package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.Order;
import com.artisans.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUser(User user);
    List<Order> findByStatus(String status);
    List<Order> findByPlacedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findByTotalAmountGreaterThan(BigDecimal amount);
    List<Order> findByUserId(Integer userId);

}
