package com.restaurant.modules.menu.dto;

import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class MenuDto {

    // Utilise par MenuService.getAllCategories() et MenuController
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CategoryResponse implements Serializable {
        private Long id;
        private String name;
        private String description;
        private String imageUrl;
        private Integer displayOrder;
        private boolean active;
        private Integer dishCount;
    }

    // Utilise par MenuService.getFullMenu() et MenuController.getFullMenu()
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CategoryWithDishes implements Serializable {
        private Long id;
        private String name;
        private String description;
        private String imageUrl;
        private List<DishResponse> dishes;
    }

    // Utilise par MenuController et MenuService pour les plats
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DishResponse implements Serializable {
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

    // Utilise par MenuController.createCategory() et MenuService.createCategory()
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CategoryRequest {
        private String name;
        private String description;
        private String imageUrl;
        private Integer displayOrder;
    }

    // Utilise par MenuController.createDish() et MenuService.createDish()
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DishRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private boolean available;
        private boolean featured;
        private Integer prepTimeMinutes;
        private String allergens;
        private Long categoryId;
    }

    // Alias pour compatibilite avec CreateDishRequest et CreateCategoryRequest
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateDishRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private boolean available;
        private boolean featured;
        private Integer prepTimeMinutes;
        private String allergens;
        private Long categoryId;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateCategoryRequest {
        private String name;
        private String description;
        private String imageUrl;
        private Integer displayOrder;
    }
}
