package com.artisans.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.artisans.dto.ProductCardDTO;
import com.artisans.dto.ProductCreateRequest;
import com.artisans.dto.ProductDetailDTO;
import com.artisans.dto.ProductResponse;
import com.artisans.dto.ReviewDTO;
import com.artisans.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/home")
    public List<ProductCardDTO> home() {
        return productService.homeProducts();
    }

    @GetMapping
    public List<ProductCardDTO> explore(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return productService.exploreProducts(category, maxPrice);
    }
    @GetMapping("/categories")
    public List<String> categories() {
        return productService.getCategories();
    }

    @GetMapping("/{id}")
    public ProductDetailDTO detail(@PathVariable Integer id) {
        return productService.productDetail(id);
    }

    @GetMapping("/{id}/reviews")
    public List<ReviewDTO> reviews(@PathVariable Integer id) {
        return productService.reviews(id);
    }
}
