package com.restaurant.modules.address.repository;

import com.restaurant.modules.address.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);
    long countByUserId(Long userId);
    Optional<Address> findByUserIdAndDefaultAddressTrue(Long userId);
}
