package com.restaurant.modules.supplement.repository;

import com.restaurant.modules.supplement.entity.Supplement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupplementRepository extends JpaRepository<Supplement, Long> {
    List<Supplement> findByDishIdAndAvailableTrue(Long dishId);
    List<Supplement> findByDishId(Long dishId);
}
