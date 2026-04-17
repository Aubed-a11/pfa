package com.restaurant.modules.address.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "delivery_zones")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class DeliveryZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "delivery_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal deliveryFee;

    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes;

    @Column(name = "is_active")
    private boolean active = true;
}
