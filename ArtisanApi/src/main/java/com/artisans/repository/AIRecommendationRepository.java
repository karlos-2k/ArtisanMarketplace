package com.artisans.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.AIRecommendation;
import com.artisans.entity.User;

import java.util.Optional;

@Repository
public interface AIRecommendationRepository extends JpaRepository<AIRecommendation, Integer> {
    Optional<AIRecommendation> findByUser(User user);
    boolean existsByUser(User user);
    void deleteByUser(User user);
}
