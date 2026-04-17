package com.restaurant.modules.payment.dto;

import com.restaurant.modules.payment.entity.Payment.PaymentMethod;
import com.restaurant.modules.payment.entity.Payment.PaymentStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SessionResponse {
        private String sessionId;
        private String checkoutUrl;
        private Long orderId;
        private BigDecimal amount;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private Long orderId;
        private BigDecimal amount;
        private PaymentMethod method;
        private PaymentStatus status;
        private String stripeSessionId;
        private LocalDateTime paidAt;
    }
}
