package com.restaurant.modules.accounting.controller;

import com.restaurant.modules.order.repository.OrderRepository;
import com.restaurant.shared.response.ApiResponse;
import com.restaurant.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Statistiques", description = "Tableau de bord")
public class StatsController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    @Operation(summary = "Donnees du tableau de bord admin")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(buildStats()));
    }

    @GetMapping("/summary")
    @Operation(summary = "Resume statistiques")
    public ResponseEntity<ApiResponse<DashboardStats>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(buildStats()));
    }

    private DashboardStats buildStats() {
        LocalDateTime startOfDay   = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay     = LocalDateTime.now().with(LocalTime.MAX);
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);

        BigDecimal revenueToday = orderRepository.sumRevenueByPeriod(startOfDay, endOfDay);
        BigDecimal revenueMonth = orderRepository.sumRevenueByPeriod(startOfMonth, endOfDay);
        Long ordersToday        = orderRepository.countByPeriod(startOfDay, endOfDay);
        long totalUsers         = userRepository.count();

        return DashboardStats.builder()
                .revenueToday(revenueToday != null ? revenueToday : BigDecimal.ZERO)
                .revenueMonth(revenueMonth != null ? revenueMonth : BigDecimal.ZERO)
                .ordersToday(ordersToday  != null ? ordersToday  : 0L)
                .totalUsers(totalUsers)
                .build();
    }

    @Data @Builder
    public static class DashboardStats {
        private BigDecimal revenueToday;
        private BigDecimal revenueMonth;
        private Long ordersToday;
        private Long totalUsers;
    }
}
