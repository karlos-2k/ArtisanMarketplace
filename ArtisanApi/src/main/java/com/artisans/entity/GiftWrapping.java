package com.artisans.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "gift_wrapping")
public class GiftWrapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "wrapping_style_id", nullable = false)
    private WrappingStyle wrappingStyle;

    private String message;

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

	public WrappingStyle getWrappingStyle() {
		return wrappingStyle;
	}

	public void setWrappingStyle(WrappingStyle wrappingStyle) {
		this.wrappingStyle = wrappingStyle;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

    // Getters and Setters
}
