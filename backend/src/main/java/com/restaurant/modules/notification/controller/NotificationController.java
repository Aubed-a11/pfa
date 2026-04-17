package com.restaurant.modules.notification.controller;

import com.restaurant.modules.notification.entity.FcmToken.DeviceType;
import com.restaurant.modules.notification.service.NotificationService;
import com.restaurant.shared.response.ApiResponse;
import com.restaurant.user.entity.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/token")
    public ResponseEntity<ApiResponse<Void>> registerToken(
            @AuthenticationPrincipal User user,
            @RequestBody TokenRequest request) {
        notificationService.registerToken(user, request.getToken(), request.getDeviceType());
        return ResponseEntity.ok(ApiResponse.success("Token enregistré", null));
    }

    @DeleteMapping("/token")
    public ResponseEntity<ApiResponse<Void>> removeToken(@RequestBody TokenRequest request) {
        notificationService.removeToken(request.getToken());
        return ResponseEntity.ok(ApiResponse.success("Token supprimé", null));
    }

    @Data
    public static class TokenRequest {
        private String token;
        private DeviceType deviceType;
    }
}
