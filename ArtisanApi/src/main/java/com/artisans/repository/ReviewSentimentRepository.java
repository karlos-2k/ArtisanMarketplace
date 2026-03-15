package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.ProductReview;
import com.artisans.entity.ReviewSentiment;

import java.util.Optional;
import java.util.List;

@Repository
public interface ReviewSentimentRepository extends JpaRepository<ReviewSentiment, Integer> {
    Optional<ReviewSentiment> findByReview(ProductReview review);
    List<ReviewSentiment> findBySentimentLabel(String sentimentLabel);
    List<ReviewSentiment> findByModelVersion(String modelVersion);
}
