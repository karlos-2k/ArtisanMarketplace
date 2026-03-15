package com.artisans.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.artisans.dto.CartItemDto;
import com.artisans.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /* ================= GET CART ================= */
    @GetMapping
    public List<CartItemDto> getCart(Principal principal) {
        return cartService.getCartItems(principal.getName());
    }

    /* ================= ADD ================= */
    @PostMapping("/{productId}")
    public void addToCart(
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "1") Integer quantity,
            Principal principal
    ) {
        cartService.addToCart(principal.getName(), productId, quantity);
    }

    /* ================= UPDATE ================= */
    @PutMapping("/{productId}")
    public void updateQuantity(
            @PathVariable Integer productId,
            @RequestParam Integer quantity,
            Principal principal
    ) {
        cartService.updateQuantity(principal.getName(), productId, quantity);
    }

    /* ================= REMOVE ================= */
    @DeleteMapping("/{productId}")
    public void removeFromCart(
            @PathVariable Integer productId,
            Principal principal
    ) {
        cartService.removeFromCart(principal.getName(), productId);
    }

    /* ================= CLEAR ================= */
    @DeleteMapping("/clear")
    public void clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
    }
}
