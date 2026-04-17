package com.restaurant.modules.promotion.repository;

import com.restaurant.modules.promotion.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByCodeAndActiveTrue(String code);
}
