package com.artisans.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductCardDTO {
    public Integer id;
    public String name;
    public String category;
    public BigDecimal price;
    public List<Integer> imageIds;
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
	public List<Integer> getImageIds() {
		return imageIds;
	}
	public void setImageIds(List<Integer> imageIds) {
		this.imageIds = imageIds;
	}
    
    
}
