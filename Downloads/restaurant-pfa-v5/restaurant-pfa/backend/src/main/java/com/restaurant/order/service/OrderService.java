package com.pfa.backend.order.service;

import com.pfa.backend.menu.entity.MenuItem;
import com.pfa.backend.menu.repository.MenuItemRepository;
import com.pfa.backend.order.dto.*;
import com.pfa.backend.order.entity.*;
import com.pfa.backend.order.repository.OrderRepository;
import com.pfa.backend.user.entity.User;
import com.pfa.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional
    public OrderDto createOrder(String userEmail, CreateOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        Order order = Order.builder()
                .user(user)
                .notes(request.getNotes())
                .status(OrderStatus.EN_ATTENTE)
                .totalAmount(BigDecimal.ZERO)
                .build();

        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu item non trouvé: " + itemReq.getMenuItemId()));

            if (!menuItem.isAvailable()) {
                throw new IllegalStateException("Menu item non disponible: " + menuItem.getName());
            }

            return OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(items);

        BigDecimal total = items.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        return toDto(orderRepository.save(order));
    }

    public List<OrderDto> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public OrderDto getById(Long id) {
        return toDto(orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Commande non trouvée: " + id)));
    }

    @Transactional
    public OrderDto updateStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Commande non trouvée: " + id));
        order.setStatus(newStatus);
        return toDto(orderRepository.save(order));
    }

    // ---- Mapper ----
    private OrderDto toDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(i -> OrderItemDto.builder()
                        .menuItemId(i.getMenuItem().getId())
                        .menuItemName(i.getMenuItem().getName())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userEmail(order.getUser().getEmail())
                .items(itemDtos)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
