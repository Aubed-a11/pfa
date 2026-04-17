package com.restaurant.modules.order.dto;

import com.restaurant.modules.order.entity.DeliveryMode;
import com.restaurant.modules.order.entity.OrderStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateRequest {
        private List<OrderItemRequest> items;
        private Integer tableNumber;
        private String specialNote;
        private DeliveryMode deliveryMode;
        private Long deliveryAddressId;
        private String promoCode;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemRequest {
        private Long dishId;
        private Integer quantity;
        private List<Long> supplementIds;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class StatusUpdateRequest {
        private OrderStatus status;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private OrderStatus status;
        private DeliveryMode deliveryMode;
        private Integer tableNumber;
        private String specialNote;
        private BigDecimal deliveryFee;
        private BigDecimal totalAmount;
        private List<OrderItemResponse> items;
        private Long userId;
        private String userName;
        private LocalDateTime createdAt;
        private LocalDateTime deliveredAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private Long dishId;
        private String dishName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
