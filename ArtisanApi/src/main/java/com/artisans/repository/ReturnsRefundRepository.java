package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.Order;
import com.artisans.entity.ReturnsRefund;

import java.util.Optional;
import java.util.List;

@Repository
public interface ReturnsRefundRepository extends JpaRepository<ReturnsRefund, Integer> {
    Optional<ReturnsRefund> findByOrder(Order order);
    List<ReturnsRefund> findByStatus(String status);
}
