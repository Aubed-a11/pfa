package com.restaurant.modules.order.service;

import com.restaurant.modules.menu.entity.Dish;
import com.restaurant.modules.menu.repository.DishRepository;
import com.restaurant.modules.order.dto.OrderDto;
import com.restaurant.modules.order.entity.Order;
import com.restaurant.modules.order.entity.OrderItem;
import com.restaurant.modules.order.repository.OrderRepository;
import com.restaurant.shared.exception.BadRequestException;
import com.restaurant.shared.exception.ResourceNotFoundException;
import com.restaurant.user.entity.User;
import com.restaurant.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public OrderDto.OrderResponse createOrder(OrderDto.CreateOrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (request.getType() == Order.OrderType.DINE_IN && (request.getTableNumber() == null || request.getTableNumber().isBlank())) {
            throw new BadRequestException("Le numéro de table est requis pour une commande sur place");
        }

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .type(request.getType())
                .tableNumber(request.getTableNumber())
                .deliveryAddress(request.getDeliveryAddress())
                .notes(request.getNotes())
                .status(Order.OrderStatus.RECEIVED)
                .paid(false)
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderDto.OrderItemRequest itemReq : request.getItems()) {
            Dish dish = dishRepository.findById(itemReq.getDishId())
                    .orElseThrow(() -> new ResourceNotFoundException("Plat introuvable : " + itemReq.getDishId()));

            if (!dish.isAvailable()) {
                throw new BadRequestException("Le plat '" + dish.getName() + "' n'est plus disponible");
            }

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .dish(dish)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(dish.getPrice())
                    .specialInstructions(itemReq.getSpecialInstructions())
                    .build();

            order.getItems().add(item);
            total = total.add(dish.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        OrderDto.OrderResponse response = toOrderResponse(saved);

        // Notifier le personnel en temps réel
        messagingTemplate.convertAndSend("/topic/orders/new", response);

        return response;
    }

    public List<OrderDto.OrderResponse> getActiveOrders() {
        return orderRepository.findByStatusInOrderByCreatedAtAsc(
                List.of(Order.OrderStatus.RECEIVED, Order.OrderStatus.PREPARING, Order.OrderStatus.READY)
        ).stream().map(this::toOrderResponse).toList();
    }

    public List<OrderDto.OrderResponse> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toOrderResponse).toList();
    }

    public OrderDto.OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable : " + id));
        return toOrderResponse(order);
    }

    @Transactional
    public OrderDto.OrderResponse updateStatus(Long id, OrderDto.UpdateStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable : " + id));

        order.setStatus(request.getStatus());
        if (request.getEstimatedMinutes() != null) {
            order.setEstimatedMinutes(request.getEstimatedMinutes());
        }

        Order saved = orderRepository.save(order);
        OrderDto.OrderResponse response = toOrderResponse(saved);

        // Notifier le client + le tableau de bord
        messagingTemplate.convertAndSend("/topic/orders/" + id + "/status", response);
        messagingTemplate.convertAndSend("/topic/orders/updated", response);

        return response;
    }

    public List<OrderDto.OrderResponse> getOrdersByPeriod(LocalDateTime from, LocalDateTime to) {
        return orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(from, to)
                .stream().map(this::toOrderResponse).toList();
    }

    // ── Helpers ────────────────────────────────────────────

    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uid = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "ORD-" + date + "-" + uid;
    }

    private OrderDto.OrderResponse toOrderResponse(Order o) {
        List<OrderDto.OrderItemResponse> items = o.getItems().stream()
                .map(item -> OrderDto.OrderItemResponse.builder()
                        .dishId(item.getDish().getId())
                        .dishName(item.getDish().getName())
                        .dishImageUrl(item.getDish().getImageUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .specialInstructions(item.getSpecialInstructions())
                        .build())
                .toList();

        return OrderDto.OrderResponse.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
                .status(o.getStatus())
                .type(o.getType())
                .tableNumber(o.getTableNumber())
                .deliveryAddress(o.getDeliveryAddress())
                .notes(o.getNotes())
                .totalAmount(o.getTotalAmount())
                .paid(o.isPaid())
                .estimatedMinutes(o.getEstimatedMinutes())
                .items(items)
                .customerName(o.getUser() != null ? o.getUser().getName() : "Anonyme")
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}
