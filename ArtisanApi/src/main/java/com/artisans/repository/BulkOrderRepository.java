package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.BulkOrder;
import com.artisans.entity.Product;
import com.artisans.entity.User;

import java.util.List;

@Repository
public interface BulkOrderRepository extends JpaRepository<BulkOrder, Integer> {
    List<BulkOrder> findByUser(User user);
    List<BulkOrder> findByProduct(Product product);
    List<BulkOrder> findByStatus(String status);
    List<BulkOrder> findByUserAndStatus(User user, String status);
}
