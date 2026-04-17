package com.restaurant.modules.address.service;

import com.restaurant.modules.address.dto.AddressDto;
import com.restaurant.modules.address.entity.Address;
import com.restaurant.modules.address.repository.AddressRepository;
import com.restaurant.shared.exception.BadRequestException;
import com.restaurant.shared.exception.ResourceNotFoundException;
import com.restaurant.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private static final int MAX_ADDRESSES = 3;

    public List<AddressDto.Response> getMyAddresses(User user) {
        return addressRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public AddressDto.Response addAddress(User user, AddressDto.Request request) {
        if (addressRepository.countByUserId(user.getId()) >= MAX_ADDRESSES) {
            throw new BadRequestException("Maximum " + MAX_ADDRESSES + " adresses autorisées");
        }
        if (request.isDefaultAddress()) {
            clearDefault(user.getId());
        }
        Address address = Address.builder()
                .label(request.getLabel())
                .street(request.getStreet())
                .city(request.getCity())
                .zipCode(request.getZipCode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .defaultAddress(request.isDefaultAddress())
                .user(user)
                .build();
        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressDto.Response updateAddress(Long id, User user, AddressDto.Request request) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adresse introuvable"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Accès refusé");
        }
        if (request.isDefaultAddress()) {
            clearDefault(user.getId());
        }
        address.setLabel(request.getLabel());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setZipCode(request.getZipCode());
        address.setDefaultAddress(request.isDefaultAddress());
        return toResponse(addressRepository.save(address));
    }

    public void deleteAddress(Long id, User user) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adresse introuvable"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Accès refusé");
        }
        addressRepository.delete(address);
    }

    private void clearDefault(Long userId) {
        addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                .ifPresent(a -> { a.setDefaultAddress(false); addressRepository.save(a); });
    }

    private AddressDto.Response toResponse(Address a) {
        return AddressDto.Response.builder()
                .id(a.getId()).label(a.getLabel()).street(a.getStreet())
                .city(a.getCity()).zipCode(a.getZipCode())
                .latitude(a.getLatitude()).longitude(a.getLongitude())
                .defaultAddress(a.isDefaultAddress()).build();
    }
}
