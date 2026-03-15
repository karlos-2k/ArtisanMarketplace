package com.artisans.dto;

import java.time.LocalDateTime;

public class ProductReviewResponseDto {

    private Integer id;

    private Integer productId;

    private Integer userId;

    private String userName;

    private Integer rating;

    private String review;

    private LocalDateTime createdAt;

    public ProductReviewResponseDto() {
    }

    public ProductReviewResponseDto(
            Integer id,
            Integer productId,
            Integer userId,
            String userName,
            Integer rating,
            String review,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.userName = userName;
        this.rating = rating;
        this.review = review;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}