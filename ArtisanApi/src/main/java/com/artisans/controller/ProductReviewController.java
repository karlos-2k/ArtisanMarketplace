package com.artisans.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.artisans.dto.ProductReviewResponseDto;
import com.artisans.entity.ProductReview;
import com.artisans.service.ProductReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ProductReviewController {

    private final ProductReviewService reviewService;

    public ProductReviewController(ProductReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /* ================= CREATE ================= */

    @PostMapping("/{productId}/{userId}")
    public ProductReview addReview(
            @PathVariable Integer productId,
            @PathVariable Integer userId,
            @RequestParam Integer rating,
            @RequestParam String review
    ) {

        return reviewService.addReview(productId, userId, rating, review);

    }

    /* ================= GET PRODUCT REVIEWS ================= */

    @GetMapping("/product/{productId}")
    public List<ProductReviewResponseDto> getReviewsByProduct(
            @PathVariable Integer productId
    ) {
        return reviewService.getReviewsByProduct(productId);
    }

    /* ================= GET AVG RATING ================= */

    @GetMapping("/avg/{productId}")
    public Double getAverageRating(
            @PathVariable Integer productId
    ) {

        return reviewService.getAverageRating(productId);

    }

    /* ================= UPDATE ================= */

    @PutMapping("/{reviewId}")
    public ProductReview updateReview(
            @PathVariable Integer reviewId,
            @RequestParam Integer rating,
            @RequestParam String review
    ) {

        return reviewService.updateReview(reviewId, rating, review);

    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Integer reviewId) {

        reviewService.deleteReview(reviewId);

    }

}