package com.artisans.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.artisans.dto.StoryDto;
import com.artisans.entity.ArtisanProfile;
import com.artisans.entity.Story;
import com.artisans.repository.ArtisanProfileRepository;
import com.artisans.repository.StoryRepository;
import com.artisans.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
public class StoryService {

    private final StoryRepository storyRepo;
    private final ArtisanProfileRepository artisanRepo;
    private final UserRepository userRepo;

    public StoryService(
			StoryRepository storyRepo,
			ArtisanProfileRepository artisanRepo,
			UserRepository userRepo
	) {
		this.storyRepo = storyRepo;
		this.artisanRepo = artisanRepo;
		this.userRepo = userRepo;
	}
    /* Resolve artisan from logged-in user */
    private ArtisanProfile getArtisan(String email) {
        var user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return artisanRepo.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Artisan profile not found"));
    }

    /* ================= CREATE STORY ================= */
    @Transactional
    public void createStory(
            String email,
            String title,
            String content,
            byte[] media,
            String mediaType
    ) {
        ArtisanProfile artisan = getArtisan(email);

        Story story = new Story();
        story.setArtisan(artisan);
        story.setTitle(title);
        story.setContent(content);
        story.setMedia(media);
        story.setMediaType(mediaType);

        storyRepo.save(story);
    }

    /* ================= GET ALL STORIES ================= */
    public List<StoryDto> getStories() {

        return storyRepo.findAll().stream().map(s ->
            new StoryDto(
                s.getId(),
                s.getArtisan().getId(),
                s.getArtisan().getUser().getName(),
                s.getTitle(),
                s.getContent(),
                s.getMedia() != null ? "/api/stories/media/" + s.getId() : null,
                s.getViews()
            )
        ).toList();
    }

    /* ================= VIEW COUNT ================= */
    @Transactional
    public void incrementViews(Integer id) {
        Story s = storyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Story not found"));
        s.setViews(s.getViews() + 1);
    }

    /* ================= MEDIA ================= */
    public Story getStory(Integer id) {
        return storyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Story not found"));
    }
}
