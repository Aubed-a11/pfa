package com.restaurant.modules.menu.service;

import com.restaurant.modules.menu.dto.MenuDto;
import com.restaurant.modules.menu.entity.Category;
import com.restaurant.modules.menu.entity.Dish;
import com.restaurant.modules.menu.repository.CategoryRepository;
import com.restaurant.modules.menu.repository.DishRepository;
import com.restaurant.shared.exception.BadRequestException;
import com.restaurant.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final CategoryRepository categoryRepository;
    private final DishRepository dishRepository;

    // ── Categories ─────────────────────────────────────────

    @Cacheable("categories")
    public List<MenuDto.CategoryResponse> getAllCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::toCategoryResponse)
                .toList();
    }

    @Cacheable("menu-full")
    public List<MenuDto.CategoryWithDishes> getFullMenu() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(cat -> MenuDto.CategoryWithDishes.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .description(cat.getDescription())
                        .imageUrl(cat.getImageUrl())
                        .dishes(dishRepository.findByCategoryIdAndAvailableTrue(cat.getId())
                                .stream().map(this::toDishResponse).toList())
                        .build())
                .toList();
    }

    @Transactional
    @CacheEvict(value = {"categories", "menu-full"}, allEntries = true)
    public MenuDto.CategoryResponse createCategory(MenuDto.CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Une catégorie avec ce nom existe déjà");
        }
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .displayOrder(request.getDisplayOrder())
                .active(true)
                .build();
        return toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    @CacheEvict(value = {"categories", "menu-full"}, allEntries = true)
    public MenuDto.CategoryResponse updateCategory(Long id, MenuDto.CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable : " + id));
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        category.setDisplayOrder(request.getDisplayOrder());
        return toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    @CacheEvict(value = {"categories", "menu-full"}, allEntries = true)
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable : " + id));
        category.setActive(false);
        categoryRepository.save(category);
    }

    // ── Dishes ─────────────────────────────────────────────

    public List<MenuDto.DishResponse> getAllDishes() {
        return dishRepository.findByAvailableTrue().stream()
                .map(this::toDishResponse).toList();
    }

    public List<MenuDto.DishResponse> searchDishes(String query) {
        return dishRepository.searchByName(query).stream()
                .map(this::toDishResponse).toList();
    }

    public MenuDto.DishResponse getDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plat introuvable : " + id));
        return toDishResponse(dish);
    }

    @Transactional
    @CacheEvict(value = "menu-full", allEntries = true)
    public MenuDto.DishResponse createDish(MenuDto.DishRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable : " + request.getCategoryId()));

        Dish dish = Dish.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .available(request.isAvailable())
                .featured(request.isFeatured())
                .prepTimeMinutes(request.getPrepTimeMinutes())
                .allergens(request.getAllergens())
                .category(category)
                .build();

        return toDishResponse(dishRepository.save(dish));
    }

    @Transactional
    @CacheEvict(value = "menu-full", allEntries = true)
    public MenuDto.DishResponse updateDish(Long id, MenuDto.DishRequest request) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plat introuvable : " + id));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable"));

        dish.setName(request.getName());
        dish.setDescription(request.getDescription());
        dish.setPrice(request.getPrice());
        dish.setImageUrl(request.getImageUrl());
        dish.setAvailable(request.isAvailable());
        dish.setFeatured(request.isFeatured());
        dish.setPrepTimeMinutes(request.getPrepTimeMinutes());
        dish.setAllergens(request.getAllergens());
        dish.setCategory(category);

        return toDishResponse(dishRepository.save(dish));
    }

    @Transactional
    @CacheEvict(value = "menu-full", allEntries = true)
    public MenuDto.DishResponse toggleAvailability(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plat introuvable : " + id));
        dish.setAvailable(!dish.isAvailable());
        return toDishResponse(dishRepository.save(dish));
    }

    @Transactional
    @CacheEvict(value = "menu-full", allEntries = true)
    public void deleteDish(Long id) {
        if (!dishRepository.existsById(id)) {
            throw new ResourceNotFoundException("Plat introuvable : " + id);
        }
        dishRepository.deleteById(id);
    }

    // ── Mappers ────────────────────────────────────────────

    private MenuDto.CategoryResponse toCategoryResponse(Category c) {
        return MenuDto.CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .imageUrl(c.getImageUrl())
                .displayOrder(c.getDisplayOrder())
                .active(c.isActive())
                .dishCount(c.getDishes() != null ? c.getDishes().size() : 0)
                .build();
    }

    private MenuDto.DishResponse toDishResponse(Dish d) {
        return MenuDto.DishResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .description(d.getDescription())
                .price(d.getPrice())
                .imageUrl(d.getImageUrl())
                .available(d.isAvailable())
                .featured(d.isFeatured())
                .prepTimeMinutes(d.getPrepTimeMinutes())
                .allergens(d.getAllergens())
                .categoryId(d.getCategory().getId())
                .categoryName(d.getCategory().getName())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
