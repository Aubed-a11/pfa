package com.pfa.backend.menu.service;

import com.pfa.backend.menu.dto.MenuItemDto;
import com.pfa.backend.menu.dto.MenuItemRequest;
import com.pfa.backend.menu.entity.MenuCategory;
import com.pfa.backend.menu.entity.MenuItem;
import com.pfa.backend.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public List<MenuItemDto> getAllItems() {
        return menuItemRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<MenuItemDto> getAvailableItems() {
        return menuItemRepository.findByAvailableTrue().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<MenuItemDto> getByCategory(MenuCategory category) {
        return menuItemRepository.findByCategoryAndAvailableTrue(category).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MenuItemDto getById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item non trouvé: " + id));
        return toDto(item);
    }

    public MenuItemDto createItem(MenuItemRequest request) {
        MenuItem item = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .available(request.isAvailable())
                .imageUrl(request.getImageUrl())
                .build();
        return toDto(menuItemRepository.save(item));
    }

    public MenuItemDto updateItem(Long id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item non trouvé: " + id));
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setAvailable(request.isAvailable());
        item.setImageUrl(request.getImageUrl());
        return toDto(menuItemRepository.save(item));
    }

    public void toggleAvailability(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item non trouvé: " + id));
        item.setAvailable(!item.isAvailable());
        menuItemRepository.save(item);
    }

    public void deleteItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new IllegalArgumentException("Menu item non trouvé: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    // ---- Mapper ----
    private MenuItemDto toDto(MenuItem item) {
        return MenuItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory())
                .available(item.isAvailable())
                .imageUrl(item.getImageUrl())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
