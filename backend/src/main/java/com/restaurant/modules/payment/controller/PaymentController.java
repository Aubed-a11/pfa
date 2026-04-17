package com.restaurant.modules.payment.controller;

import com.restaurant.modules.payment.dto.PaymentDto;
import com.restaurant.modules.payment.entity.Payment.PaymentMethod;
import com.restaurant.modules.payment.service.PaymentService;
import com.restaurant.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/session/{orderId}")
    public ResponseEntity<ApiResponse<PaymentDto.SessionResponse>> createSession(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Session créée", paymentService.createCheckoutSession(orderId)));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sig) {
        paymentService.handleWebhook(payload, sig);
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/cash/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<PaymentDto.Response>> confirmCash(
            @PathVariable Long orderId,
            @RequestParam(defaultValue = "CASH") PaymentMethod method) {
        return ResponseEntity.ok(ApiResponse.success(
                "Paiement confirmé", paymentService.confirmCashPayment(orderId, method)));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentDto.Response>> getByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getByOrder(orderId)));
    }
}
