package com.restaurant.modules.supplement.controller;

import com.restaurant.modules.supplement.dto.SupplementDto;
import com.restaurant.modules.supplement.service.SupplementService;
import com.restaurant.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/menu/supplements")
@RequiredArgsConstructor
public class SupplementController {

    private final SupplementService supplementService;

    @GetMapping("/dish/{dishId}")
    public ResponseEntity<ApiResponse<List<SupplementDto.Response>>> getByDish(@PathVariable Long dishId) {
        return ResponseEntity.ok(ApiResponse.success(supplementService.getByDish(dishId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SupplementDto.Response>> create(@RequestBody SupplementDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Supplément créé", supplementService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SupplementDto.Response>> update(@PathVariable Long id,
                                                                       @RequestBody SupplementDto.Request request) {
        return ResponseEntity.ok(ApiResponse.success("Supplément mis à jour", supplementService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        supplementService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Supplément supprimé", null));
    }
}
