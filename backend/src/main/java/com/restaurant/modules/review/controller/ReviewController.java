package com.restaurant.modules.review.controller;

import com.restaurant.modules.review.dto.ReviewDto;
import com.restaurant.modules.review.service.ReviewService;
import com.restaurant.shared.response.ApiResponse;
import com.restaurant.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDto.Response>> create(
            @AuthenticationPrincipal User user,
            @RequestBody ReviewDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Avis ajouté", reviewService.createReview(user, request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ReviewDto.Response>>> myReviews(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getMyReviews(user)));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<ReviewDto.Response>>> latest(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getLatestReviews(limit)));
    }

    @GetMapping("/average")
    public ResponseEntity<ApiResponse<Double>> average() {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getAverageRating()));
    }
}
