package com.restaurant.modules.order.controller;

import com.restaurant.modules.order.dto.OrderDto;
import com.restaurant.modules.order.entity.OrderStatus;
import com.restaurant.modules.order.service.OrderService;
import com.restaurant.shared.response.ApiResponse;
import com.restaurant.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Commandes", description = "Gestion des commandes")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Créer une commande")
    public ResponseEntity<ApiResponse<OrderDto.Response>> create(
            @AuthenticationPrincipal User user,
            @RequestBody OrderDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Commande créée", orderService.createOrder(user, request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Operation(summary = "Toutes les commandes (admin/staff)")
    public ResponseEntity<ApiResponse<List<OrderDto.Response>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders()));
    }

    @GetMapping("/my")
    @Operation(summary = "Mes commandes")
    public ResponseEntity<ApiResponse<List<OrderDto.Response>>> getMyOrders(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getMyOrders(user)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une commande")
    public ResponseEntity<ApiResponse<OrderDto.Response>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getById(id)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Operation(summary = "Mettre à jour le statut")
    public ResponseEntity<ApiResponse<OrderDto.Response>> updateStatus(
            @PathVariable Long id,
            @RequestBody OrderDto.StatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Statut mis à jour", orderService.updateStatus(id, request.getStatus())));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Annuler une commande")
    public ResponseEntity<ApiResponse<OrderDto.Response>> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Commande annulée", orderService.cancelOrder(id, user)));
    }
}
