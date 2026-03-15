package com.artisans.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.artisans.dto.WishlistProductDto;
import com.artisans.service.WishlistService;


@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
		this.wishlistService = wishlistService;
	}
    /* ================= GET WISHLIST ================= */
    @GetMapping
    public List<WishlistProductDto> getWishlist(Principal principal) {
        return wishlistService.getWishlistProducts(principal.getName());
    }


    /* ================= ADD ================= */
    @PostMapping("/{productId}")
    public void addToWishlist(
            @PathVariable Integer productId,
            Principal principal
    ) {
        wishlistService.addToWishlist(principal.getName(), productId);
    }

    /* ================= REMOVE ================= */
    @DeleteMapping("/{productId}")
    public void removeFromWishlist(
            @PathVariable Integer productId,
            Principal principal
    ) {
        wishlistService.removeFromWishlist(principal.getName(), productId);
    }

    /* ================= CHECK ================= */
    @GetMapping("/check/{productId}")
    public boolean checkWishlist(
            @PathVariable Integer productId,
            Principal principal
    ) {
        return wishlistService.isInWishlist(principal.getName(), productId);
    }
}
