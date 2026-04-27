package com.pfa.backend.order.repository;

import com.pfa.backend.order.entity.Order;
import com.pfa.backend.order.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
