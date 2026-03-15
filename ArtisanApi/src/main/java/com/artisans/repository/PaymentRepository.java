package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.Order;
import com.artisans.entity.Payment;

import java.util.Optional;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByOrder(Order order);
    Optional<Payment> findByTransactionId(String transactionId);
    List<Payment> findByStatus(String status);
    List<Payment> findByPaymentMethod(String method);
    Optional<Payment> findByOrderId(Integer orderId);
    Optional<Payment> findTopByStatusOrderByIdDesc(String status);
}
