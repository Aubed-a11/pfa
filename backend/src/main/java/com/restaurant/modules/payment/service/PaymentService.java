package com.restaurant.modules.payment.service;

import com.restaurant.modules.order.entity.Order;
import com.restaurant.modules.order.repository.OrderRepository;
import com.restaurant.modules.payment.dto.PaymentDto;
import com.restaurant.modules.payment.entity.Payment;
import com.restaurant.modules.payment.entity.Payment.PaymentMethod;
import com.restaurant.modules.payment.entity.Payment.PaymentStatus;
import com.restaurant.modules.payment.repository.PaymentRepository;
import com.restaurant.shared.exception.BadRequestException;
import com.restaurant.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Value("${stripe.secret-key:sk_test_PLACEHOLDER}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret:whsec_PLACEHOLDER}")
    private String webhookSecret;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * Créer une session Stripe Checkout
     * Nécessite : com.stripe:stripe-java dans pom.xml
     */
    @Transactional
    public PaymentDto.SessionResponse createCheckoutSession(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));

        if (paymentRepository.findByOrderId(orderId).isPresent()) {
            throw new BadRequestException("Un paiement existe déjà pour cette commande");
        }

        // TODO: Intégrer Stripe SDK
        // Stripe.apiKey = stripeSecretKey;
        // SessionCreateParams params = SessionCreateParams.builder()
        //     .setMode(SessionCreateParams.Mode.PAYMENT)
        //     .setSuccessUrl(frontendUrl + "/order/" + orderId + "/success")
        //     .setCancelUrl(frontendUrl + "/order/" + orderId + "/cancel")
        //     .addLineItem(...)
        //     .build();
        // Session session = Session.create(params);

        // Simulation pour Phase 1
        String mockSessionId = "cs_test_" + orderId + "_" + System.currentTimeMillis();

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .method(PaymentMethod.STRIPE)
                .status(PaymentStatus.PENDING)
                .stripeSessionId(mockSessionId)
                .build();
        paymentRepository.save(payment);

        log.info("[STRIPE MOCK] Session créée pour commande #{}: {}", orderId, mockSessionId);

        return PaymentDto.SessionResponse.builder()
                .sessionId(mockSessionId)
                .checkoutUrl("https://checkout.stripe.com/pay/" + mockSessionId)
                .orderId(orderId)
                .amount(order.getTotalAmount())
                .build();
    }

    /**
     * Webhook Stripe — appelé par Stripe après paiement
     */
    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        // TODO: Vérifier signature Stripe
        // Webhook.constructEvent(payload, sigHeader, webhookSecret)

        // Simulation : parser le payload manuellement
        log.info("[STRIPE WEBHOOK] Reçu: {}", payload.substring(0, Math.min(100, payload.length())));

        // En production, extraire session_id et mettre à jour le payment
        // Payment payment = paymentRepository.findByStripeSessionId(sessionId)...
        // payment.setStatus(PaymentStatus.PAID);
        // payment.setPaidAt(LocalDateTime.now());
    }

    /**
     * Paiement en cash/TPE — confirme sans Stripe
     */
    @Transactional
    public PaymentDto.Response confirmCashPayment(Long orderId, PaymentMethod method) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .method(method)
                .status(PaymentStatus.PAID)
                .paidAt(LocalDateTime.now())
                .transactionRef("CASH-" + orderId)
                .build();

        return toResponse(paymentRepository.save(payment));
    }

    public PaymentDto.Response getByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Paiement introuvable"));
    }

    private PaymentDto.Response toResponse(Payment p) {
        return PaymentDto.Response.builder()
                .id(p.getId())
                .orderId(p.getOrder().getId())
                .amount(p.getAmount())
                .method(p.getMethod())
                .status(p.getStatus())
                .stripeSessionId(p.getStripeSessionId())
                .paidAt(p.getPaidAt())
                .build();
    }
}
