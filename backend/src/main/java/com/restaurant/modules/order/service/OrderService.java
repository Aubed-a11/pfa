package com.restaurant.modules.order.service;

import com.restaurant.modules.menu.entity.Dish;
import com.restaurant.modules.menu.repository.DishRepository;
import com.restaurant.modules.notification.service.NotificationService;
import com.restaurant.modules.order.dto.OrderDto;
import com.restaurant.modules.order.entity.*;
import com.restaurant.modules.order.repository.OrderItemRepository;
import com.restaurant.modules.order.repository.OrderRepository;
import com.restaurant.modules.order.statemachine.OrderStateMachine;
import com.restaurant.shared.exception.BadRequestException;
import com.restaurant.shared.exception.ResourceNotFoundException;
import com.restaurant.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final DishRepository dishRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @Transactional
    public OrderDto.Response createOrder(User user, OrderDto.CreateRequest request) {
        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderDto.OrderItemRequest itemReq : request.getItems()) {
            Dish dish = dishRepository.findById(itemReq.getDishId())
                    .orElseThrow(() -> new ResourceNotFoundException("Plat introuvable: " + itemReq.getDishId()));

            if (!dish.isAvailable()) {
                throw new BadRequestException("Le plat '" + dish.getName() + "' n'est plus disponible");
            }

            BigDecimal itemTotal = dish.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(itemTotal);

            OrderItem item = OrderItem.builder()
                    .dish(dish)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(dish.getPrice())
                    .build();
            items.add(item);
        }

        // Frais de livraison
        BigDecimal deliveryFee = BigDecimal.ZERO;
        DeliveryMode mode = request.getDeliveryMode() != null ? request.getDeliveryMode() : DeliveryMode.DELIVERY;
        if (mode == DeliveryMode.DELIVERY) {
            deliveryFee = new BigDecimal("15.00"); // TODO: calcul par zone
        }
        total = total.add(deliveryFee);

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .deliveryMode(mode)
                .tableNumber(request.getTableNumber() != null ? request.getTableNumber() : 0)
                .specialNote(request.getSpecialNote())
                .deliveryFee(deliveryFee)
                .totalAmount(total)
                .items(new ArrayList<>())
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : items) {
            item.setOrder(savedOrder);
            savedOrder.getItems().add(orderItemRepository.save(item));
        }

        // Notifier le back-office + mobile
        notificationService.notifyNewOrder(savedOrder.getId(),
                request.getTableNumber() != null ? request.getTableNumber() : 0);
        notificationService.notifyOrderStatusChange(
                savedOrder.getId(), user.getId(), OrderStatus.PENDING);

        log.info("Commande #{} créée pour {}", savedOrder.getId(), user.getEmail());
        return toResponse(savedOrder);
    }

    @Transactional
    public OrderDto.Response updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));

        // Validation machine d'états
        OrderStateMachine.validate(order.getStatus(), newStatus);

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }

        Order saved = orderRepository.save(order);

        // Notification push + WebSocket
        notificationService.notifyOrderStatusChange(
                orderId, order.getUser().getId(), newStatus);

        log.info("Commande #{}: {} → {}", orderId, oldStatus, newStatus);
        return toResponse(saved);
    }

    public List<OrderDto.Response> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<OrderDto.Response> getMyOrders(User user) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrderDto.Response getById(Long id) {
        return toResponse(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable")));
    }

    @Transactional
    public OrderDto.Response cancelOrder(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));

        // Seul le propriétaire ou un admin peut annuler
        boolean isOwner = order.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("Accès refusé");
        }

        OrderStateMachine.validate(order.getStatus(), OrderStatus.CANCELLED);
        order.setStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);

        notificationService.notifyOrderStatusChange(orderId, order.getUser().getId(), OrderStatus.CANCELLED);

        return toResponse(saved);
    }

    private OrderDto.Response toResponse(Order order) {
        List<OrderDto.OrderItemResponse> items = order.getItems() == null ? List.of() :
                order.getItems().stream().map(item -> OrderDto.OrderItemResponse.builder()
                        .id(item.getId())
                        .dishId(item.getDish().getId())
                        .dishName(item.getDish().getName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build()).collect(Collectors.toList());

        return OrderDto.Response.builder()
                .id(order.getId())
                .status(order.getStatus())
                .deliveryMode(order.getDeliveryMode())
                .tableNumber(order.getTableNumber())
                .specialNote(order.getSpecialNote())
                .deliveryFee(order.getDeliveryFee())
                .totalAmount(order.getTotalAmount())
                .items(items)
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .createdAt(order.getCreatedAt())
                .deliveredAt(order.getDeliveredAt())
                .build();
    }
}
