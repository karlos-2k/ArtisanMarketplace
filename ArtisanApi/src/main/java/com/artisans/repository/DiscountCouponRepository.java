package com.artisans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artisans.entity.DiscountCoupon;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface DiscountCouponRepository extends JpaRepository<DiscountCoupon, Integer> {
    Optional<DiscountCoupon> findByCode(String code);
    List<DiscountCoupon> findByValidUntilAfter(LocalDate date);
    boolean existsByCode(String code);
}
