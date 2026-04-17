package com.restaurant.modules.order.statemachine;

import com.restaurant.modules.order.entity.OrderStatus;
import com.restaurant.shared.exception.BadRequestException;
import java.util.Map;
import java.util.Set;

public class OrderStateMachine {

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_TRANSITIONS = Map.of(
        OrderStatus.PENDING,          Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
        OrderStatus.CONFIRMED,        Set.of(OrderStatus.PREPARING, OrderStatus.CANCELLED),
        OrderStatus.PREPARING,        Set.of(OrderStatus.OUT_FOR_DELIVERY, OrderStatus.READY),
        OrderStatus.OUT_FOR_DELIVERY, Set.of(OrderStatus.DELIVERED),
        OrderStatus.DELIVERED,        Set.of(),
        OrderStatus.CANCELLED,        Set.of()
    );

    public static void validate(OrderStatus current, OrderStatus next) {
        Set<OrderStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(next)) {
            throw new BadRequestException(
                "Transition interdite : " + current + " → " + next +
                ". Transitions autorisées : " + allowed
            );
        }
    }
}
