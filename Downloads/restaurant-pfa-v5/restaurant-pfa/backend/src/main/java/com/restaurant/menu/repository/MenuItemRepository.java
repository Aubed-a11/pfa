package com.pfa.backend.menu.repository;

import com.pfa.backend.menu.entity.MenuCategory;
import com.pfa.backend.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByAvailableTrue();
    List<MenuItem> findByCategoryAndAvailableTrue(MenuCategory category);
    List<MenuItem> findByNameContainingIgnoreCase(String name);
}
