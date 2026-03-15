package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.GiftWrapping;
import com.artisans.entity.Order;
import com.artisans.entity.WrappingStyle;

import java.util.Optional;
import java.util.List;

@Repository
public interface GiftWrappingRepository extends JpaRepository<GiftWrapping, Integer> {
    Optional<GiftWrapping> findByOrder(Order order);
    List<GiftWrapping> findByWrappingStyle(WrappingStyle wrappingStyle);
}
