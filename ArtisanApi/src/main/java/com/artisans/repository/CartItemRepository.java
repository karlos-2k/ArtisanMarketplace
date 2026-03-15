package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.Cart;
import com.artisans.entity.CartItem;
import com.artisans.entity.Product;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCart(Cart cart);
    List<CartItem> findByProduct(Product product);
    CartItem findByCartAndProduct(Cart cart, Product product);
    void deleteByCart(Cart cart);
    void deleteByCartAndProduct(Cart cart, Product product);
}
