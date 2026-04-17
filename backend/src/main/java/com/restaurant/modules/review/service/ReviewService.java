package com.restaurant.modules.review.service;

import com.restaurant.modules.order.entity.Order;
import com.restaurant.modules.order.entity.OrderStatus;
import com.restaurant.modules.order.repository.OrderRepository;
import com.restaurant.modules.review.dto.ReviewDto;
import com.restaurant.modules.review.entity.Review;
import com.restaurant.modules.review.repository.ReviewRepository;
import com.restaurant.shared.exception.BadRequestException;
import com.restaurant.shared.exception.ResourceNotFoundException;
import com.restaurant.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;

    public ReviewDto.Response createReview(User user, ReviewDto.Request request) {
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("La note doit être entre 1 et 5");
        }
        if (reviewRepository.existsByOrderId(request.getOrderId())) {
            throw new BadRequestException("Vous avez déjà évalué cette commande");
        }
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Accès refusé");
        }
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("Vous ne pouvez évaluer qu'une commande livrée");
        }
        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .user(user)
                .order(order)
                .build();
        return toResponse(reviewRepository.save(review));
    }

    public List<ReviewDto.Response> getMyReviews(User user) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ReviewDto.Response> getLatestReviews(int limit) {
        return reviewRepository.findLatestReviews(PageRequest.of(0, limit))
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Double getAverageRating() {
        return reviewRepository.findAverageRating();
    }

    private ReviewDto.Response toResponse(Review r) {
        return ReviewDto.Response.builder()
                .id(r.getId())
                .rating(r.getRating())
                .comment(r.getComment())
                .userName(r.getUser().getName())
                .orderId(r.getOrder().getId())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
