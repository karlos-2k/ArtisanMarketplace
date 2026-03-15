package com.artisans.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "review_sentiments")
public class ReviewSentiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "review_id", nullable = false)
    private ProductReview review;

    private String sentimentLabel; // e.g., POSITIVE, NEGATIVE, NEUTRAL

    private Double confidence; // e.g., 0.88
    private String modelVersion;
    private LocalDateTime analyzedAt;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public ProductReview getReview() {
		return review;
	}
	public void setReview(ProductReview review) {
		this.review = review;
	}
	public String getSentimentLabel() {
		return sentimentLabel;
	}
	public void setSentimentLabel(String sentimentLabel) {
		this.sentimentLabel = sentimentLabel;
	}
	public Double getConfidence() {
		return confidence;
	}
	public void setConfidence(Double confidence) {
		this.confidence = confidence;
	}
	public String getModelVersion() {
		return modelVersion;
	}
	public void setModelVersion(String modelVersion) {
		this.modelVersion = modelVersion;
	}
	public LocalDateTime getAnalyzedAt() {
		return analyzedAt;
	}
	public void setAnalyzedAt(LocalDateTime analyzedAt) {
		this.analyzedAt = analyzedAt;
	}
}

