package com.pfa.backend.payment.service;

import com.pfa.backend.order.entity.Order;
import com.pfa.backend.order.entity.OrderStatus;
import com.pfa.backend.order.repository.OrderRepository;
import com.pfa.backend.payment.dto.PaymentDto;
import com.pfa.backend.payment.dto.PaymentRequest;
import com.pfa.backend.payment.entity.Payment;
import com.pfa.backend.payment.entity.PaymentStatus;
import com.pfa.backend.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public PaymentDto processPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Commande non trouvée: " + request.getOrderId()));

        if (order.getStatus() == OrderStatus.ANNULE) {
            throw new IllegalStateException("Impossible de payer une commande annulée");
        }

        // Vérifier si déjà payé
        paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
            if (p.getStatus() == PaymentStatus.EFFECTUE) {
                throw new IllegalStateException("Commande déjà payée");
            }
        });

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .method(request.getMethod())
                .status(PaymentStatus.EFFECTUE)
                .transactionId(UUID.randomUUID().toString())
                .build();

        // Mettre à jour le statut de la commande
        order.setStatus(OrderStatus.CONFIRME);
        orderRepository.save(order);

        return toDto(paymentRepository.save(payment));
    }

    public PaymentDto getPaymentByOrder(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Paiement non trouvé pour la commande: " + orderId));
        return toDto(payment);
    }

    // ---- Mapper ----
    private PaymentDto toDto(Payment payment) {
        return PaymentDto.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
