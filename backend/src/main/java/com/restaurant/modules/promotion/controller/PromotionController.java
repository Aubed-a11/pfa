package com.restaurant.modules.promotion.controller;

import com.restaurant.modules.promotion.service.PromotionService;
import com.restaurant.shared.response.ApiResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/promos")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<PromotionService.PromoResult>> validate(
            @RequestBody ValidateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                promotionService.validate(request.getCode(), request.getOrderAmount())));
    }

    @Data
    public static class ValidateRequest {
        private String code;
        private BigDecimal orderAmount;
    }
}
