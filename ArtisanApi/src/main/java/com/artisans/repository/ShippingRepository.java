package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.Order;
import com.artisans.entity.Shipping;

import java.util.Optional;
import java.util.List;

@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Integer> {
    Optional<Shipping> findByOrder(Order order);
    Optional<Shipping> findByTrackingNumber(String trackingNumber);
    List<Shipping> findByStatus(String status);
}
