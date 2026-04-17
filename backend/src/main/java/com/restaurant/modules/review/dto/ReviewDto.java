package com.restaurant.modules.review.dto;

import lombok.*;
import java.time.LocalDateTime;

public class ReviewDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        private Long orderId;
        private Integer rating;
        private String comment;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private Integer rating;
        private String comment;
        private String userName;
        private Long orderId;
        private LocalDateTime createdAt;
    }
}
