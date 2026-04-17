package com.restaurant.modules.review.repository;

import com.restaurant.modules.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByOrderId(Long orderId);
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByOrderId(Long orderId);

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double findAverageRating();

    @Query("SELECT r FROM Review r ORDER BY r.createdAt DESC")
    List<Review> findLatestReviews(org.springframework.data.domain.Pageable pageable);
}
