package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.SupportChat;
import com.artisans.entity.User;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SupportChatRepository extends JpaRepository<SupportChat, Integer> {
    List<SupportChat> findByUser(User user);
    List<SupportChat> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
