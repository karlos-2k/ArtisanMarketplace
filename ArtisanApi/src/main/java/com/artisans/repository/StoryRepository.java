package com.artisans.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artisans.entity.ArtisanProfile;
import com.artisans.entity.Story;

public interface StoryRepository extends JpaRepository<Story, Integer> {

    List<Story> findByArtisanOrderByIdDesc(ArtisanProfile artisan);
}
