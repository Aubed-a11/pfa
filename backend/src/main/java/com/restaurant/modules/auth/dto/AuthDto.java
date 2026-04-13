package com.restaurant.modules.auth.dto;

import com.restaurant.user.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        @Email @NotBlank
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank
        private String name;
        @Email @NotBlank
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
        @NotBlank
        private String phone;
        private Role role = Role.CLIENT;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private UserInfo user;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Role role;
    }
}
