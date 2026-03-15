package com.artisans.dto;

import java.math.BigDecimal;

public class ProductCreateRequest {

    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String category;

    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Integer getStock() { return stock; }
    public String getCategory() { return category; }
}
