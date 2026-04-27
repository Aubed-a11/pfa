package com.pfa.backend.order.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
    private Long menuItemId;
    private String menuItemName;
    private int quantity;
    private BigDecimal unitPrice;
}
