package com.restaurant.modules.menu.controller;

import com.restaurant.modules.menu.dto.MenuDto;
import com.restaurant.modules.menu.service.MenuService;
import com.restaurant.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
@Tag(name = "Menu", description = "Gestion du menu, catégories et plats")
public class MenuController {

    private final MenuService menuService;

    // ── Menu complet ───────────────────────────────────────
    @GetMapping("/full")
    @Operation(summary = "Récupérer le menu complet groupé par catégories")
    public ResponseEntity<ApiResponse<List<MenuDto.CategoryWithDishes>>> getFullMenu() {
        return ResponseEntity.ok(ApiResponse.success(menuService.getFullMenu()));
    }

    // ── Categories ─────────────────────────────────────────
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<MenuDto.CategoryResponse>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(menuService.getAllCategories()));
    }

    @PostMapping("/categories")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<MenuDto.CategoryResponse>> createCategory(
            @Valid @RequestBody MenuDto.CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Catégorie créée", menuService.createCategory(request)));
    }

    @PutMapping("/categories/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<MenuDto.CategoryResponse>> updateCategory(
            @PathVariable Long id, @Valid @RequestBody MenuDto.CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Catégorie mise à jour", menuService.updateCategory(id, request)));
    }

    @DeleteMapping("/categories/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        menuService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // ── Dishes ─────────────────────────────────────────────
    @GetMapping("/dishes")
    public ResponseEntity<ApiResponse<List<MenuDto.DishResponse>>> getDishes(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(ApiResponse.success(menuService.searchDishes(search)));
        }
        return ResponseEntity.ok(ApiResponse.success(menuService.getAllDishes()));
    }

    @GetMapping("/dishes/{id}")
    public ResponseEntity<ApiResponse<MenuDto.DishResponse>> getDish(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(menuService.getDishById(id)));
    }

    @PostMapping("/dishes")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<MenuDto.DishResponse>> createDish(
            @Valid @RequestBody MenuDto.DishRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Plat créé", menuService.createDish(request)));
    }

    @PutMapping("/dishes/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<MenuDto.DishResponse>> updateDish(
            @PathVariable Long id, @Valid @RequestBody MenuDto.DishRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Plat mis à jour", menuService.updateDish(id, request)));
    }

    @PatchMapping("/dishes/{id}/toggle")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<MenuDto.DishResponse>> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(menuService.toggleAvailability(id)));
    }

    @DeleteMapping("/dishes/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> deleteDish(@PathVariable Long id) {
        menuService.deleteDish(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
