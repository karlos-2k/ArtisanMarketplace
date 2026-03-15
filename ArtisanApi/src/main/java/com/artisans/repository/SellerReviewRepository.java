package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.SellerReview;
import com.artisans.entity.User;

import java.util.List;

@Repository
public interface SellerReviewRepository extends JpaRepository<SellerReview, Integer> {
    List<SellerReview> findBySeller(User seller);
    List<SellerReview> findByUser(User user);
    List<SellerReview> findByRating(Integer rating);
}
