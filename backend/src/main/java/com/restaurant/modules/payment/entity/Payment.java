package com.restaurant.modules.payment.entity;

import com.restaurant.modules.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "stripe_session_id")
    private String stripeSessionId;

    @Column(name = "transaction_ref")
    private String transactionRef;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    public enum PaymentMethod { STRIPE, CASH, TERMINAL }
    public enum PaymentStatus { PENDING, PAID, REFUNDED, FAILED }
}
