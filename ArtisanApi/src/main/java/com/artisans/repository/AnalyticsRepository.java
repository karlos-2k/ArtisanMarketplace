package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.Analytics;
import com.artisans.entity.User;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Integer> {
    List<Analytics> findByUser(User user);
    List<Analytics> findByEventType(String eventType);
    List<Analytics> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    void deleteByUser(User user);
}
