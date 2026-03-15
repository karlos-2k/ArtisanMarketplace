package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.ArtisanProfile;
import com.artisans.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtisanProfileRepository extends JpaRepository<ArtisanProfile, Integer> {
    Optional<ArtisanProfile> findByUser(User user);
    boolean existsByUser(User user);
	List<ArtisanProfile> findByBioContainingIgnoreCase(String keyword);
}
