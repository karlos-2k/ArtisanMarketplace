package com.artisans.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String category;
    private LocalDateTime createdAt;
    private Integer artisanId;

    public ProductResponse(Integer id, String name, String description,
                           BigDecimal price, Integer stock,
                           String category, LocalDateTime createdAt,
                           Integer artisanId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.createdAt = createdAt;
        this.artisanId = artisanId;
    }

    /* getters */
	public Integer getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public Integer getStock() {
		return stock;
	}

	public String getCategory() {
		return category;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public Integer getArtisanId() {
		return artisanId;
	}
}