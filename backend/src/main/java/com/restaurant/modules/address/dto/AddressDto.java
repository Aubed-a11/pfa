package com.restaurant.modules.address.dto;

import lombok.*;

public class AddressDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        private String label;
        private String street;
        private String city;
        private String zipCode;
        private Double latitude;
        private Double longitude;
        private boolean defaultAddress;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private String label;
        private String street;
        private String city;
        private String zipCode;
        private Double latitude;
        private Double longitude;
        private boolean defaultAddress;
    }
}
