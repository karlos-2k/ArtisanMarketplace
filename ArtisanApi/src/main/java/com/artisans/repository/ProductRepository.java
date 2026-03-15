package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.artisans.entity.ArtisanProfile;
import com.artisans.entity.Product;

import java.math.BigDecimal;
import java.util.List;
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findTop8ByOrderByCreatedAtDesc();
    List<Product> filter(
        @Param("category") String category,
        @Param("maxPrice") BigDecimal maxPrice
    );
    List<Product> findByArtisan(ArtisanProfile artisan);
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategories();
}
