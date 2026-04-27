package com.pfa.backend.menu.controller;

import com.pfa.backend.menu.dto.MenuItemDto;
import com.pfa.backend.menu.dto.MenuItemRequest;
import com.pfa.backend.menu.entity.MenuCategory;
import com.pfa.backend.menu.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    // Routes publiques
    @GetMapping("/public")
    public ResponseEntity<List<MenuItemDto>> getAvailable() {
        return ResponseEntity.ok(menuService.getAvailableItems());
    }

    @GetMapping("/public/category/{category}")
    public ResponseEntity<List<MenuItemDto>> getByCategory(@PathVariable MenuCategory category) {
        return ResponseEntity.ok(menuService.getByCategory(category));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<MenuItemDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getById(id));
    }

    // Routes admin
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MenuItemDto>> getAll() {
        return ResponseEntity.ok(menuService.getAllItems());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> create(@Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.createItem(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> update(@PathVariable Long id,
                                              @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(menuService.updateItem(id, request));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggle(@PathVariable Long id) {
        menuService.toggleAvailability(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        menuService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
