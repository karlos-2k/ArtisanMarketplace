package com.artisans.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_predictions")
public class FraudPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Optionally link to Order or Payment
    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false)
    private Double fraudScore; // e.g., 0.85 = 85% likely fraud

    @Column(nullable = false)
    private Boolean isFraud; // True if fraudScore >= threshold

    private String modelVersion; // e.g., "v1.3-local"

    private LocalDateTime predictedAt;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public Double getFraudScore() {
		return fraudScore;
	}

	public void setFraudScore(Double fraudScore) {
		this.fraudScore = fraudScore;
	}

	public Boolean getIsFraud() {
		return isFraud;
	}

	public void setIsFraud(Boolean isFraud) {
		this.isFraud = isFraud;
	}

	public String getModelVersion() {
		return modelVersion;
	}

	public void setModelVersion(String modelVersion) {
		this.modelVersion = modelVersion;
	}

	public LocalDateTime getPredictedAt() {
		return predictedAt;
	}

	public void setPredictedAt(LocalDateTime predictedAt) {
		this.predictedAt = predictedAt;
	}
    
}
