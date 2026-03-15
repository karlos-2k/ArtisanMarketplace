package com.artisans.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.artisans.dto.ApiResponse;
import com.artisans.dto.SellerProductDTO;
import com.artisans.entity.ProductMedia;
import com.artisans.entity.User;
import com.artisans.repository.ProductMediaRepository;
import com.artisans.repository.UserRepository;
import com.artisans.service.SellerProductService;

@RestController
@RequestMapping("/api/seller/products")
@PreAuthorize("hasRole('SELLER')")
public class SellerProductController {

    private final SellerProductService service;
    private final UserRepository userRepo;
	private ProductMediaRepository mediaRepo;

    public SellerProductController(
            SellerProductService service,
            UserRepository userRepo,ProductMediaRepository mediaRepo) {

        this.service = service;
        this.userRepo = userRepo;
        this.mediaRepo = mediaRepo;
    }

    /* ================= HELPER ================= */

    private User seller(Principal principal) {
        return userRepo.findByEmail(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    /* ================= READ ================= */

    /**
     * GET /api/seller/products
     * Get all products of logged-in seller
     */
    @GetMapping
    public ResponseEntity<List<SellerProductDTO>> products(
            Principal principal) {

        return ResponseEntity.ok(
                service.sellerProducts(seller(principal))
        );
    }

    /* ================= CREATE ================= */

    /**
     * POST /api/seller/products
     * Create a new product with images
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> create(
            Principal principal,
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam BigDecimal price,
            @RequestParam Integer stock,
            @RequestParam(required = false) String description,
            @RequestParam("images") List<MultipartFile> images) {

        service.create(
                seller(principal),
                name,
                category,
                description,
                price,
                stock,
                images
        );

        return ResponseEntity.ok(
                new ApiResponse("Product created successfully")
        );
    }

    /* ================= UPDATE ================= */

    /**
     * PUT /api/seller/products/{id}
     * Update product (only owner seller)
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(
            Principal principal,
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestParam BigDecimal price,
            @RequestParam Integer stock) {

        service.update(
                seller(principal),
                id,
                name,
                price,
                stock
        );

        return ResponseEntity.ok(
                new ApiResponse("Product updated successfully")
        );
    }

    /* ================= DELETE ================= */

    /**
     * DELETE /api/seller/products/{id}
     * Delete product (only owner seller)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(
            Principal principal,
            @PathVariable Integer id) {

        service.delete(
                seller(principal),
                id
        );

        return ResponseEntity.ok(
                new ApiResponse("Product deleted successfully")
        );
    }
    
    @GetMapping(
    	    value = "/image/{id}",
    	    produces = MediaType.IMAGE_JPEG_VALUE
    	)
    	public ResponseEntity<byte[]> image(@PathVariable Integer id) {

    	    ProductMedia media = mediaRepo.findById(id)
    	        .orElseThrow(() -> new RuntimeException("Image not found"));

    	    return ResponseEntity.ok()
    	        .contentType(MediaType.parseMediaType(media.getMediaType()))
    	        .body(media.getData());
    	}

}
