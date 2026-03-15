package com.artisans.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.artisans.entity.ProductMedia;
import com.artisans.repository.ProductMediaRepository;

@RestController
@RequestMapping("/api/products/media")
public class ProductMediaController {

    private final ProductMediaRepository mediaRepo;

    public ProductMediaController(ProductMediaRepository mediaRepo) {
        this.mediaRepo = mediaRepo;
    }

    /* ================= STREAM IMAGE / VIDEO ================= */
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getMedia(@PathVariable Integer id) {

        ProductMedia media = mediaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found"));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, media.getMediaType())
                .body(media.getData());
    }
}
