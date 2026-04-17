package com.restaurant.modules.supplement.service;

import com.restaurant.modules.menu.entity.Dish;
import com.restaurant.modules.menu.repository.DishRepository;
import com.restaurant.modules.supplement.dto.SupplementDto;
import com.restaurant.modules.supplement.entity.Supplement;
import com.restaurant.modules.supplement.repository.SupplementRepository;
import com.restaurant.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplementService {

    private final SupplementRepository supplementRepository;
    private final DishRepository dishRepository;

    public List<SupplementDto.Response> getByDish(Long dishId) {
        return supplementRepository.findByDishIdAndAvailableTrue(dishId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public SupplementDto.Response create(SupplementDto.Request request) {
        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new ResourceNotFoundException("Plat introuvable"));
        Supplement s = Supplement.builder()
                .name(request.getName())
                .extraPrice(request.getExtraPrice())
                .available(request.isAvailable())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .dish(dish)
                .build();
        return toResponse(supplementRepository.save(s));
    }

    public SupplementDto.Response update(Long id, SupplementDto.Request request) {
        Supplement s = supplementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplément introuvable"));
        s.setName(request.getName());
        s.setExtraPrice(request.getExtraPrice());
        s.setAvailable(request.isAvailable());
        if (request.getDisplayOrder() != null) s.setDisplayOrder(request.getDisplayOrder());
        return toResponse(supplementRepository.save(s));
    }

    public void delete(Long id) {
        supplementRepository.deleteById(id);
    }

    private SupplementDto.Response toResponse(Supplement s) {
        return SupplementDto.Response.builder()
                .id(s.getId())
                .name(s.getName())
                .extraPrice(s.getExtraPrice())
                .available(s.isAvailable())
                .displayOrder(s.getDisplayOrder())
                .build();
    }
}
