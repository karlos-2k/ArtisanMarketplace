package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.LoginActivity;
import com.artisans.entity.User;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoginActivityRepository extends JpaRepository<LoginActivity, Integer> {
    List<LoginActivity> findByUser(User user);
    List<LoginActivity> findByStatus(String status);
    List<LoginActivity> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
}
