package com.restaurant.modules.order.repository;

import com.restaurant.modules.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByStatusInOrderByCreatedAtAsc(List<Order.OrderStatus> statuses);

    List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime from, LocalDateTime to);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :from AND o.createdAt <= :to")
    Long countByPeriod(LocalDateTime from, LocalDateTime to);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paid = true AND o.createdAt >= :from AND o.createdAt <= :to")
    java.math.BigDecimal sumRevenueByPeriod(LocalDateTime from, LocalDateTime to);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatus();
}
