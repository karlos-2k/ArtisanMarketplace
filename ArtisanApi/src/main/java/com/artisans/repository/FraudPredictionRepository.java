package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.FraudPrediction;
import com.artisans.entity.Order;

import java.util.Optional;
import java.util.List;

@Repository
public interface FraudPredictionRepository extends JpaRepository<FraudPrediction, Integer> {
    Optional<FraudPrediction> findByOrder(Order order);
    List<FraudPrediction> findByIsFraudTrue();
    List<FraudPrediction> findByModelVersion(String modelVersion);
}
