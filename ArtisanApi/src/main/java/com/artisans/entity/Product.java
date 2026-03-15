package com.artisans.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@NamedQueries({
	@NamedQuery(
			name = "Product.filter",
			query = "SELECT p FROM Product p WHERE "
					+ "(:category IS NULL OR p.category = :category) AND "
					+ "(:maxPrice IS NULL OR p.price <= :maxPrice)"
			)
})
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private ArtisanProfile artisan;

    private String name;

    @Column(length = 3000)
    private String description;

    private BigDecimal price;
    private Integer stock;
    private String category;

    private LocalDateTime createdAt;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public ArtisanProfile getArtisan() {
		return artisan;
	}

	public void setArtisan(ArtisanProfile artisan) {
		this.artisan = artisan;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

   
}
