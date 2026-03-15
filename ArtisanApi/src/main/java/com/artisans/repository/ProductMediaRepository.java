package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.Product;
import com.artisans.entity.ProductMedia;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductMediaRepository extends JpaRepository<ProductMedia, Integer> {

    Optional<ProductMedia> findByProductIdAndPrimaryImageTrue(Integer productId);
    Optional<ProductMedia> findByProductAndPrimaryImageTrue(Product product);
    List<ProductMedia> findByProductIdOrderByPrimaryImageDesc(Integer productId);
    List<ProductMedia> findByProduct(Product product);
}
