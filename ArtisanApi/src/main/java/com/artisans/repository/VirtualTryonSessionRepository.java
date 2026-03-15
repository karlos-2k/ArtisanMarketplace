package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.Product;
import com.artisans.entity.User;
import com.artisans.entity.VirtualTryonSession;

import java.util.List;

@Repository
public interface VirtualTryonSessionRepository extends JpaRepository<VirtualTryonSession, Integer> {
    List<VirtualTryonSession> findByUser(User user);
    List<VirtualTryonSession> findByProduct(Product product);
}
