package com.artisans.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.artisans.dto.SellerProductDTO;
import com.artisans.entity.*;
import com.artisans.repository.*;

@Service
public class SellerProductService {

    private final ProductRepository productRepo;
    private final ProductMediaRepository mediaRepo;
    private final ArtisanProfileRepository artisanRepo;

    public SellerProductService(
            ProductRepository productRepo,
            ProductMediaRepository mediaRepo,
            ArtisanProfileRepository artisanRepo) {

        this.productRepo = productRepo;
        this.mediaRepo = mediaRepo;
        this.artisanRepo = artisanRepo;
    }

    /* CREATE */
    public Product create(
            User seller,
            String name,
            String category,
            String description,
            BigDecimal price,
            Integer stock,
            List<MultipartFile> images
    ) {
        ArtisanProfile artisan = artisanRepo.findByUser(seller)
                .orElseThrow(() -> new RuntimeException("Artisan profile not found"));

        Product p = new Product();
        p.setArtisan(artisan);
        p.setName(name);
        p.setCategory(category);
        p.setDescription(description);
        p.setPrice(price);
        p.setStock(stock);

        p = productRepo.save(p);

        boolean primary = true;
        for (MultipartFile file : images) {
            try {
                ProductMedia media = new ProductMedia();
                media.setProduct(p);
                media.setMediaType(file.getContentType());
                media.setData(file.getBytes());
                media.setPrimaryImage(primary);
                mediaRepo.save(media);
                primary = false;
            } catch (Exception e) {
                throw new RuntimeException("Image save failed");
            }
        }

        return p;
    }

    /* READ (SELLER PRODUCTS) */
    public List<SellerProductDTO> sellerProducts(User seller) {
        ArtisanProfile artisan = artisanRepo.findByUser(seller)
                .orElseThrow(() -> new RuntimeException("Artisan not found"));

        return productRepo.findByArtisan(artisan)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /* UPDATE */
    public Product update(
            User seller,
            Integer productId,
            String name,
            BigDecimal price,
            Integer stock
    ) {
        Product p = ownedProduct(seller, productId);
        p.setName(name);
        p.setPrice(price);
        p.setStock(stock);
        return productRepo.save(p);
    }

    /* DELETE */
    public void delete(User seller, Integer productId) {
        Product p = ownedProduct(seller, productId);
        mediaRepo.deleteAll(mediaRepo.findByProduct(p));
        productRepo.delete(p);
    }

    /* SECURITY CHECK */
    private Product ownedProduct(User seller, Integer productId) {
        ArtisanProfile artisan = artisanRepo.findByUser(seller)
                .orElseThrow(() -> new RuntimeException("Artisan not found"));

        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!p.getArtisan().getId().equals(artisan.getId())) {
            throw new RuntimeException("Unauthorized access");
        }
        return p;
    }

    private SellerProductDTO toDTO(Product p) {

        SellerProductDTO dto = new SellerProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setCategory(p.getCategory());
        dto.setPrice(p.getPrice());
        dto.setStock(p.getStock());
        dto.setDescription(p.getDescription());

        List<ProductMedia> mediaList = mediaRepo.findByProduct(p);

        dto.setImageIds(
            mediaList.stream()
                .map(ProductMedia::getId)
                .toList()
        );

        mediaList.stream()
            .filter(ProductMedia::isPrimaryImage)
            .findFirst()
            .ifPresent(m -> dto.setMainImageId(m.getId()));

        return dto;
    }

}
