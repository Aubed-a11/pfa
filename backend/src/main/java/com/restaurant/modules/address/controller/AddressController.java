package com.restaurant.modules.address.controller;

import com.restaurant.modules.address.dto.AddressDto;
import com.restaurant.modules.address.service.AddressService;
import com.restaurant.shared.response.ApiResponse;
import com.restaurant.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressDto.Response>>> getMyAddresses(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(addressService.getMyAddresses(user)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressDto.Response>> addAddress(
            @AuthenticationPrincipal User user,
            @RequestBody AddressDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Adresse ajoutée", addressService.addAddress(user, request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressDto.Response>> update(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @RequestBody AddressDto.Request request) {
        return ResponseEntity.ok(ApiResponse.success("Adresse mise à jour",
                addressService.updateAddress(id, user, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        addressService.deleteAddress(id, user);
        return ResponseEntity.ok(ApiResponse.success("Adresse supprimée", null));
    }
}
