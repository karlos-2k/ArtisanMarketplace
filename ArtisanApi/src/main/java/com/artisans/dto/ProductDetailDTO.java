package com.artisans.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductDetailDTO {
    public Integer id;
    public String name;
    public String artisan;
    public String category;
    public BigDecimal price;
    public Integer stock;
    public String description;
    public List<Integer> imageIds;
    public Double avgRating;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getArtisan() {
		return artisan;
	}
	public void setArtisan(String artisan) {
		this.artisan = artisan;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public Integer getStock() {
		return stock;
	}
	public void setStock(Integer stock) {
		this.stock = stock;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<Integer> getImageIds() {
		return imageIds;
	}
	public void setImageIds(List<Integer> imageIds) {
		this.imageIds = imageIds;
	}
	public Double getAvgRating() {
		return avgRating;
	}
	public void setAvgRating(Double avgRating) {
		this.avgRating = avgRating;
	}
    
}
