package com.artisans.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.artisans.dto.CartItemDto;
import com.artisans.entity.Cart;
import com.artisans.entity.CartItem;
import com.artisans.entity.Product;
import com.artisans.entity.User;
import com.artisans.repository.CartItemRepository;
import com.artisans.repository.CartRepository;
import com.artisans.repository.ProductMediaRepository;
import com.artisans.repository.ProductRepository;
import com.artisans.repository.UserRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductMediaRepository mediaRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            ProductMediaRepository mediaRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.mediaRepository = mediaRepository;
    }

    /* ================= USER ================= */

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    /* ================= GET CART ================= */

    public List<CartItemDto> getCartItems(String email) {

        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        return cartItemRepository.findByCart(cart).stream().map(item -> {

            Product p = item.getProduct();

            String imageUrl = mediaRepository
                    .findByProductAndPrimaryImageTrue(p)
                    .map(m -> "/api/products/media/" + m.getId())
                    .orElse(null);

            return new CartItemDto(
                    p.getId(),
                    p.getName(),
                    p.getPrice(),
                    item.getQuantity(),
                    imageUrl,
                    p.getArtisan().getUser().getName()
            );
        }).toList();
    }

    /* ================= ADD ================= */

    @Transactional
    public void addToCart(String email, Integer productId, Integer quantity) {

        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product);

        if (item != null) {
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
        }

        cartItemRepository.save(item);
    }

    /* ================= UPDATE ================= */

    @Transactional
    public void updateQuantity(String email, Integer productId, Integer quantity) {

        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product);

        if (item == null) {
            throw new RuntimeException("Item not found in cart");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return;
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }

    /* ================= REMOVE ================= */

    @Transactional
    public void removeFromCart(String email, Integer productId) {

        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cartItemRepository.deleteByCartAndProduct(cart, product);
    }

    /* ================= CLEAR ================= */

    @Transactional
    public void clearCart(String email) {

        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        cartItemRepository.deleteByCart(cart);
    }
}
