package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.Order;
import com.artisans.entity.OrderItem;
import com.artisans.entity.Product;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrder(Order order);
    List<OrderItem> findByProduct(Product product);
    List<OrderItem> findByOrderAndProduct(Order order, Product product);
}
