package com.restaurant.modules.order.dto;

import com.restaurant.modules.order.entity.Order;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateOrderRequest {
        @NotEmpty(message = "La commande doit contenir au moins un article")
        private List<OrderItemRequest> items;
        @NotNull
        private Order.OrderType type;
        private String tableNumber;
        private String deliveryAddress;
        private String notes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemRequest {
        @NotNull
        private Long dishId;
        @Min(1)
        private int quantity;
        private String specialInstructions;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateStatusRequest {
        @NotNull
        private Order.OrderStatus status;
        private Integer estimatedMinutes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OrderResponse {
        private Long id;
        private String orderNumber;
        private Order.OrderStatus status;
        private Order.OrderType type;
        private String tableNumber;
        private String deliveryAddress;
        private String notes;
        private BigDecimal totalAmount;
        private boolean paid;
        private Integer estimatedMinutes;
        private List<OrderItemResponse> items;
        private String customerName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemResponse {
        private Long dishId;
        private String dishName;
        private String dishImageUrl;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
        private String specialInstructions;
    }
}
