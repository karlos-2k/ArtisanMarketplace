package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.InteractionLog;
import com.artisans.entity.User;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InteractionLogRepository extends JpaRepository<InteractionLog, Integer> {
    List<InteractionLog> findByUser(User user);
    List<InteractionLog> findByPageName(String pageName);
    List<InteractionLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
}
