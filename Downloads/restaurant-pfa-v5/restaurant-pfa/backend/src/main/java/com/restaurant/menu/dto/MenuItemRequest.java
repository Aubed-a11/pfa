package com.pfa.backend.menu.dto;

import com.pfa.backend.menu.entity.MenuCategory;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequest {

    @NotBlank(message = "Le nom est requis")
    private String name;

    private String description;

    @NotNull(message = "Le prix est requis")
    @DecimalMin(value = "0.01", message = "Le prix doit être positif")
    private BigDecimal price;

    @NotNull(message = "La catégorie est requise")
    private MenuCategory category;

    private boolean available = true;

    private String imageUrl;
}
