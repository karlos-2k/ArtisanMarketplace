package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.InfluencerPromotion;
import com.artisans.entity.Product;
import com.artisans.entity.User;

import java.util.List;

@Repository
public interface InfluencerPromotionRepository extends JpaRepository<InfluencerPromotion, Integer> {
    List<InfluencerPromotion> findByUser(User user);
    List<InfluencerPromotion> findByProduct(Product product);
    List<InfluencerPromotion> findByEngagementCountGreaterThan(Integer count);
}
