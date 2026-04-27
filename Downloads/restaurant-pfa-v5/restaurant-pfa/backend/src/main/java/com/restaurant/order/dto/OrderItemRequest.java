package com.pfa.backend.order.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {

    @NotNull(message = "L'ID du menu item est requis")
    private Long menuItemId;

    @Min(value = 1, message = "La quantité doit être au moins 1")
    private int quantity;
}
