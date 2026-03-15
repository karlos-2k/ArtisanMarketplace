package com.artisans.service;

import java.util.List;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.artisans.dto.*;
import com.artisans.entity.*;
import com.artisans.repository.*;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final ArtisanProfileRepository artisanRepo;
    private final PasswordEncoder encoder;

    public AuthService(UserRepository userRepo,
                       RoleRepository roleRepo,
                       ArtisanProfileRepository artisanRepo,
                       PasswordEncoder encoder) {

        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.artisanRepo = artisanRepo;
        this.encoder = encoder;
    }

    /* ================= BUYER REGISTRATION ================= */

    public void registerBuyer(BuyerRegisterRequest req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Role buyerRole = roleRepo.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("ROLE_CUSTOMER not found"));

        User user = new User();
        user.setName(req.getName()); 
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setEnabled(true);
        user.setRoles(List.of(buyerRole)); // ✅ IMPORTANT

        userRepo.save(user);
    }


    /* ================= ARTISAN / SELLER REGISTRATION ================= */

    public void registerArtisan(ArtisanRegisterRequest req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Role sellerRole = roleRepo.findByName("ROLE_SELLER")
                .orElseThrow(() -> new RuntimeException("ROLE_SELLER not found"));

        User user = new User();
        user.setName(req.getName()); 
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setEnabled(true);
        user.setRoles(List.of(sellerRole)); // ✅ IMPORTANT

        userRepo.save(user);

        ArtisanProfile profile = new ArtisanProfile();
        profile.setUser(user);
        profile.setBio(req.getBio());
        profile.setInstagramLink(req.getInstagramLink());

        artisanRepo.save(profile);
    }
    
    public void assignGoogleRole(User user, String role) {
        Role r = role.equals("artisan")
            ? roleRepo.findByName("ROLE_SELLER").orElseThrow()
            : roleRepo.findByName("ROLE_CUSTOMER").orElseThrow();

        user.setRoles(List.of(r));
        userRepo.save(user);
    }

}
