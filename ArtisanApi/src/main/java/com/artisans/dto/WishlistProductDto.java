package com.artisans.dto;

import java.math.BigDecimal;

public class WishlistProductDto {

    private Integer id;
    private String name;
    private BigDecimal price;
    private String category;
    private String primaryImageUrl;
    private String artisanName;
    private Integer stock;   // NEW FIELD

    public WishlistProductDto(
            Integer id,
            String name,
            BigDecimal price,
            String category,
            String primaryImageUrl,
            String artisanName,
            Integer stock
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.primaryImageUrl = primaryImageUrl;
        this.artisanName = artisanName;
        this.stock = stock;   // NEW
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public String getCategory() { return category; }
    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public String getArtisanName() { return artisanName; }
    public Integer getStock() { return stock; }   // NEW
}