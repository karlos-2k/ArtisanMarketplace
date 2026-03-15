package com.artisans.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.artisans.dto.WishlistProductDto;
import com.artisans.entity.Product;
import com.artisans.entity.User;
import com.artisans.entity.Wishlist;
import com.artisans.repository.ProductMediaRepository;
import com.artisans.repository.ProductRepository;
import com.artisans.repository.UserRepository;
import com.artisans.repository.WishlistRepository;

import lombok.RequiredArgsConstructor;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
	private ProductMediaRepository mediaRepository;

    
    public WishlistService(
			WishlistRepository wishlistRepository,
			UserRepository userRepository,
			ProductRepository productRepository,
			ProductMediaRepository mediaRepository
	) {
		this.wishlistRepository = wishlistRepository;
		this.userRepository = userRepository;
		this.productRepository = productRepository;
		this.mediaRepository = mediaRepository;
	}
    /* ================= INTERNAL USER RESOLUTION ================= */
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /* ================= GET ================= */
    private User getUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<WishlistProductDto> getWishlistProducts(String email) {

        User user = getUser(email);

        return wishlistRepository.findByUser(user).stream().map(w -> {

            Product p = w.getProduct();

            String imageUrl = mediaRepository
                .findByProductAndPrimaryImageTrue(p)
                .map(m -> "/api/products/media/" + m.getId())
                .orElse(null);

            return new WishlistProductDto(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getCategory(),
                imageUrl,
                p.getArtisan().getUser().getName(),
                p.getStock()   // NEW
            );
        }).toList();
    }

    /* ================= ADD ================= */
    @Transactional
    public void addToWishlist(String email, Integer productId) {

        User user = getUserByEmail(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            return; // prevent duplicates
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        wishlistRepository.save(wishlist);
    }

    /* ================= REMOVE ================= */
    @Transactional
    public void removeFromWishlist(String email, Integer productId) {

        User user = getUserByEmail(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    /* ================= CHECK ================= */
    public boolean isInWishlist(String email, Integer productId) {

        User user = getUserByEmail(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return wishlistRepository.existsByUserAndProduct(user, product);
    }
}
