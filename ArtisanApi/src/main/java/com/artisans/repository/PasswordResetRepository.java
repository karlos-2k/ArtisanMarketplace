package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.PasswordReset;
import com.artisans.entity.User;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, Integer> {
    Optional<PasswordReset> findByUser(User user);
    Optional<PasswordReset> findByResetToken(String resetToken);
    void deleteByUser(User user);
}
