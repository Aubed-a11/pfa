package com.restaurant.modules.order.controller;

import com.restaurant.modules.order.dto.OrderDto;
import com.restaurant.modules.order.service.OrderService;
import com.restaurant.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Commandes", description = "Création et suivi des commandes")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Créer une nouvelle commande")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> createOrder(
            @Valid @RequestBody OrderDto.CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        OrderDto.OrderResponse response = orderService.createOrder(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Commande créée", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Mes commandes (historique client)")
    public ResponseEntity<ApiResponse<List<OrderDto.OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getMyOrders(userDetails.getUsername())));
    }

    @GetMapping("/active")
    @Operation(summary = "Commandes actives (cuisine / admin)")
    public ResponseEntity<ApiResponse<List<OrderDto.OrderResponse>>> getActiveOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getActiveOrders()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une commande")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Mettre à jour le statut d'une commande")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderDto.UpdateStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(id, request)));
    }
}
