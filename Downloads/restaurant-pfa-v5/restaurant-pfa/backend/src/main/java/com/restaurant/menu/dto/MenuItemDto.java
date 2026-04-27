package com.pfa.backend.menu.dto;

import com.pfa.backend.menu.entity.MenuCategory;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private MenuCategory category;
    private boolean available;
    private String imageUrl;
    private LocalDateTime createdAt;
}
