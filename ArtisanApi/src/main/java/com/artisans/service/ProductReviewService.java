package com.artisans.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.artisans.dto.ProductReviewResponseDto;
import com.artisans.entity.Product;
import com.artisans.entity.ProductReview;
import com.artisans.entity.User;
import com.artisans.repository.ProductRepository;
import com.artisans.repository.ProductReviewRepository;
import com.artisans.repository.UserRepository;

@Service
@Transactional
public class ProductReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductReviewService(
            ProductReviewRepository reviewRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /* ================= CREATE REVIEW ================= */

    public ProductReview addReview(
            Integer productId,
            Integer userId,
            Integer rating,
            String reviewText
    ) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductReview review = new ProductReview();

        review.setProduct(product);
        review.setUser(user);
        review.setRating(rating);
        review.setReview(reviewText);

        return reviewRepository.save(review);
    }

    /* ================= GET BY ID ================= */

    public ProductReview getReview(Integer id) {

        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

    }

    /* ================= GET REVIEWS BY PRODUCT ================= */

    public List<ProductReviewResponseDto> getReviewsByProduct(Integer productId) {

        return reviewRepository.findByProductId(productId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }
    /* ================= UPDATE REVIEW ================= */

    public ProductReview updateReview(
            Integer reviewId,
            Integer rating,
            String reviewText
    ) {

        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setRating(rating);
        review.setReview(reviewText);

        return reviewRepository.save(review);
    }

    /* ================= DELETE REVIEW ================= */

    public void deleteReview(Integer reviewId) {

        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        reviewRepository.delete(review);

    }

    /* ================= GET AVG RATING ================= */

    public Double getAverageRating(Integer productId) {

        Double avg = reviewRepository.avgRating(productId);

        return avg == null ? 0.0 : avg;

    }
    
    private ProductReviewResponseDto mapToDto(ProductReview review) {

        return new ProductReviewResponseDto(
                review.getId(),
                review.getProduct().getId(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getRating(),
                review.getReview(),
                review.getCreatedAt()
        );

    }

}