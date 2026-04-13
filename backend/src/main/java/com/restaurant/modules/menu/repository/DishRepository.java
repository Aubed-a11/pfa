package com.restaurant.modules.menu.repository;

import com.restaurant.modules.menu.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByCategoryIdAndAvailableTrue(Long categoryId);
    List<Dish> findByAvailableTrue();
    List<Dish> findByFeaturedTrue();

    @Query("SELECT d FROM Dish d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) AND d.available = true")
    List<Dish> searchByName(String query);
}
