package com.artisans.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.artisans.dto.StoryDto;
import com.artisans.entity.Story;
import com.artisans.service.StoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
    			this.storyService = storyService;
    }
    /* ================= CREATE STORY (ARTISAN ONLY) ================= */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void createStory(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) MultipartFile media,
            Principal principal
    ) throws Exception {

        storyService.createStory(
            principal.getName(),
            title,
            content,
            media != null ? media.getBytes() : null,
            media != null ? media.getContentType() : null
        );
    }

    /* ================= GET STORIES ================= */
    @GetMapping
    public List<StoryDto> getStories() {
        return storyService.getStories();
    }

    /* ================= STREAM MEDIA ================= */
    @GetMapping("/media/{id}")
    public ResponseEntity<byte[]> getMedia(@PathVariable Integer id) {

        Story s = storyService.getStory(id);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, s.getMediaType())
            .body(s.getMedia());
    }

    /* ================= VIEW ================= */
    @PostMapping("/{id}/view")
    public void view(@PathVariable Integer id) {
        storyService.incrementViews(id);
    }
}
