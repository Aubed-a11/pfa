package com.restaurant.modules.address.controller;

import com.restaurant.modules.address.entity.DeliveryZone;
import com.restaurant.modules.address.repository.DeliveryZoneRepository;
import com.restaurant.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/delivery-zones")
@RequiredArgsConstructor
public class DeliveryZoneController {

    private final DeliveryZoneRepository deliveryZoneRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliveryZone>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(deliveryZoneRepository.findByActiveTrue()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DeliveryZone>> create(@RequestBody DeliveryZone zone) {
        return ResponseEntity.ok(ApiResponse.success("Zone créée", deliveryZoneRepository.save(zone)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DeliveryZone>> update(
            @PathVariable Long id, @RequestBody DeliveryZone zone) {
        zone.setId(id);
        return ResponseEntity.ok(ApiResponse.success("Zone mise à jour", deliveryZoneRepository.save(zone)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        deliveryZoneRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Zone supprimée", null));
    }
}
