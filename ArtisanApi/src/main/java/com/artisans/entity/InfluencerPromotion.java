package com.artisans.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "influencer_promotions")
public class InfluencerPromotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private String storyUrl;
    private Integer engagementCount;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public Product getProduct() {
		return product;
	}
	public void setProduct(Product product) {
		this.product = product;
	}
	public String getStoryUrl() {
		return storyUrl;
	}
	public void setStoryUrl(String storyUrl) {
		this.storyUrl = storyUrl;
	}
	public Integer getEngagementCount() {
		return engagementCount;
	}
	public void setEngagementCount(Integer engagementCount) {
		this.engagementCount = engagementCount;
	}
}

