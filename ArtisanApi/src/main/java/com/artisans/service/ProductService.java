package com.artisans.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.artisans.dto.ProductCardDTO;
import com.artisans.dto.ProductDetailDTO;
import com.artisans.dto.ReviewDTO;
import com.artisans.entity.Product;
import com.artisans.entity.ProductMedia;
import com.artisans.repository.ProductMediaRepository;
import com.artisans.repository.ProductRepository;
import com.artisans.repository.ProductReviewRepository;

@Service
public class ProductService {

    private final ProductRepository productRepo;
    private final ProductMediaRepository mediaRepo;
    private final ProductReviewRepository reviewRepo;

    public ProductService(
        ProductRepository productRepo,
        ProductMediaRepository mediaRepo,
        ProductReviewRepository reviewRepo
    ) {
        this.productRepo = productRepo;
        this.mediaRepo = mediaRepo;
        this.reviewRepo = reviewRepo;
    }

    /* ================= HOME ================= */
    public List<ProductCardDTO> homeProducts() {
        return productRepo.findTop8ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toCardDTO)
                .toList();
    }

    /* ================= EXPLORE ================= */
    public List<ProductCardDTO> exploreProducts(String category, BigDecimal maxPrice) {
        return productRepo.filter(category, maxPrice)
                .stream()
                .map(this::toCardDTO)
                .toList();
    }

    /* ================= PRODUCT DETAIL ================= */
    /* ================= PRODUCT DETAIL ================= */
    public ProductDetailDTO productDetail(Integer id) {

        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductDetailDTO dto = new ProductDetailDTO();
        dto.id = p.getId();
        dto.name = p.getName();
        dto.category = p.getCategory();
        dto.price = p.getPrice();
        dto.stock = p.getStock();
        dto.description = p.getDescription();
        dto.artisan = p.getArtisan().getUser().getName();

        dto.imageIds = mediaRepo
                .findByProductIdOrderByPrimaryImageDesc(id)
                .stream()
                .map(ProductMedia::getId)
                .toList();

        dto.avgRating = reviewRepo.avgRating(id);

        return dto;
    }


    /* ================= REVIEWS ================= */
    public List<ReviewDTO> reviews(Integer productId) {
        return reviewRepo.findByProductId(productId)
                .stream()
                .map(r -> {
                    ReviewDTO d = new ReviewDTO();
                    d.user = r.getUser().getName();
                    d.rating = r.getRating();
                    d.review = r.getReview();
                    d.createdAt = r.getCreatedAt();
                    return d;
                })
                .toList();
    }

    /* ================= MAPPER ================= */
    private ProductCardDTO toCardDTO(Product p) {

        ProductCardDTO dto = new ProductCardDTO();
        dto.id = p.getId();
        dto.name = p.getName();
        dto.category = p.getCategory();
        dto.price = p.getPrice();

        dto.imageIds = mediaRepo
                .findByProductIdAndPrimaryImageTrue(p.getId())
                .stream()
                .map(ProductMedia::getId)
                .toList();

        return dto;
    }
    
    public List<String> getCategories() {

        return productRepo.findDistinctCategories();

    }

}
