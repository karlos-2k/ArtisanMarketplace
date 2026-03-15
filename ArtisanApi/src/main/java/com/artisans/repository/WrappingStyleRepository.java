package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.WrappingStyle;

import java.util.Optional;

@Repository
public interface WrappingStyleRepository extends JpaRepository<WrappingStyle, Integer> {
    Optional<WrappingStyle> findByStyleName(String styleName);
}
