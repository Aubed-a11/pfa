package com.restaurant.modules.supplement.dto;

import lombok.*;
import java.math.BigDecimal;

public class SupplementDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        private String name;
        private BigDecimal extraPrice;
        private boolean available;
        private Integer displayOrder;
        private Long dishId;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private BigDecimal extraPrice;
        private boolean available;
        private Integer displayOrder;
    }
}
