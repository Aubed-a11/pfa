package com.restaurant.modules.menu.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class MenuDto {

    // ── Category ──────────────────────────────────
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CategoryRequest {
        @NotBlank(message = "Le nom est obligatoire")
        private String name;
        private String description;
        private String imageUrl;
        private int displayOrder;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CategoryResponse {
        private Long id;
        private String name;
        private String description;
        private String imageUrl;
        private int displayOrder;
        private boolean active;
        private int dishCount;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CategoryWithDishes {
        private Long id;
        private String name;
        private String description;
        private String imageUrl;
        private List<DishResponse> dishes;
    }

    // ── Dish ──────────────────────────────────────
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DishRequest {
        @NotBlank(message = "Le nom est obligatoire")
        private String name;
        private String description;
        @NotNull @DecimalMin("0.01")
        private BigDecimal price;
        private String imageUrl;
        private boolean available = true;
        private boolean featured = false;
        private Integer prepTimeMinutes;
        private String allergens;
        @NotNull(message = "La catégorie est obligatoire")
        private Long categoryId;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DishResponse {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private boolean available;
        private boolean featured;
        private Integer prepTimeMinutes;
        private String allergens;
        private Long categoryId;
        private String categoryName;
        private LocalDateTime createdAt;
    }
}
