package com.restaurant.modules.promotion.service;

import com.restaurant.modules.promotion.entity.Promotion;
import com.restaurant.modules.promotion.repository.PromotionRepository;
import com.restaurant.shared.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public record PromoResult(String code, BigDecimal discount, BigDecimal finalAmount) {}

    public PromoResult validate(String code, BigDecimal orderAmount) {
        Promotion promo = promotionRepository.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new BadRequestException("Code promo invalide ou expiré"));

        LocalDateTime now = LocalDateTime.now();
        if (promo.getStartDate() != null && now.isBefore(promo.getStartDate())) {
            throw new BadRequestException("Ce code promo n'est pas encore actif");
        }
        if (promo.getEndDate() != null && now.isAfter(promo.getEndDate())) {
            throw new BadRequestException("Ce code promo a expiré");
        }
        if (promo.getUsageLimit() != null && promo.getUsedCount() >= promo.getUsageLimit()) {
            throw new BadRequestException("Ce code promo a atteint sa limite d'utilisation");
        }
        if (promo.getMinOrder() != null && orderAmount.compareTo(promo.getMinOrder()) < 0) {
            throw new BadRequestException("Montant minimum requis : " + promo.getMinOrder() + " MAD");
        }

        BigDecimal discount;
        if (promo.getType() == Promotion.PromoType.PERCENT) {
            discount = orderAmount.multiply(promo.getValue()).divide(BigDecimal.valueOf(100));
        } else {
            discount = promo.getValue();
        }

        BigDecimal finalAmount = orderAmount.subtract(discount).max(BigDecimal.ZERO);
        return new PromoResult(code, discount, finalAmount);
    }

    public void incrementUsage(String code) {
        promotionRepository.findByCodeAndActiveTrue(code).ifPresent(p -> {
            p.setUsedCount(p.getUsedCount() + 1);
            promotionRepository.save(p);
        });
    }

    public Promotion create(Promotion promo) {
        return promotionRepository.save(promo);
    }
}
