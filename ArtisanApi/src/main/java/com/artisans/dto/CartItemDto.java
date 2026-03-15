package com.artisans.dto;

import java.math.BigDecimal;

public class CartItemDto {

    private Integer productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private String artisanName;

    public CartItemDto(
            Integer productId,
            String productName,
            BigDecimal price,
            Integer quantity,
            String imageUrl,
            String artisanName
    ) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.artisanName = artisanName;
    }

	public Integer getProductId() {
		return productId;
	}

	public void setProductId(Integer productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getArtisanName() {
		return artisanName;
	}

	public void setArtisanName(String artisanName) {
		this.artisanName = artisanName;
	}

    // getters only (immutable DTO preferred)
    
}
