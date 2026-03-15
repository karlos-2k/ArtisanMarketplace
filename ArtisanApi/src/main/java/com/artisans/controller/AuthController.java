package com.artisans.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.artisans.dto.*;
import com.artisans.entity.User;
import com.artisans.repository.RoleRepository;
import com.artisans.repository.UserRepository;
import com.artisans.security.JwtUtil;
import com.artisans.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            AuthService authService,
            UserRepository userRepository,
            RoleRepository roleRepository) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    /* ================= EMAIL LOGIN ================= */

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response) {

        Authentication authentication =
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);

        Cookie jwt = new Cookie("jwt", token);
        jwt.setHttpOnly(true);
        jwt.setPath("/");
        jwt.setMaxAge(24 * 60 * 60);

        // ✅ IMPORTANT FOR LOCAL DEV
        jwt.setSecure(false);          // MUST be false on http
        // SameSite handled by container (Lax by default)

        response.addCookie(jwt);

        return ResponseEntity.ok().build();
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        /* 1️⃣ Delete JWT cookie */
        Cookie jwt = new Cookie("jwt", "");
        jwt.setHttpOnly(true);
        jwt.setPath("/");
        jwt.setMaxAge(0);
        jwt.setSecure(false); // localhost

        response.addCookie(jwt);

        /* 2️⃣ Invalidate HTTP session (OAuth2, OAUTH_ROLE, etc.) */
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        /* 3️⃣ Clear Spring Security context */
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok().body(
            Map.of("message", "Logged out successfully")
        );
    }




    /* ================= REGISTER ================= */

    @PostMapping("/register/buyer")
    public Map<String, String> registerBuyer(
            @RequestBody BuyerRegisterRequest request) {

        authService.registerBuyer(request);
        return Map.of("message", "Buyer registered successfully");
    }

    @PostMapping("/register/artisan")
    public Map<String, String> registerArtisan(
            @RequestBody ArtisanRegisterRequest request) {

        authService.registerArtisan(request);
        return Map.of("message", "Artisan registered successfully");
    }

    /* ================= STORE ROLE BEFORE GOOGLE LOGIN ================= */

    @PostMapping("/set-role")
    public ResponseEntity<?> setRole(
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        String role = body.get("role");
        System.out.println("Setting role to: " + role);
        if (!List.of("ROLE_SELLER", "ROLE_CUSTOMER").contains(role)) {
            return ResponseEntity.badRequest()
                    .body("Invalid role: " + role);
        }

        request.getSession().setAttribute("OAUTH_ROLE", role);

        return ResponseEntity.ok().build();
    }


    /* ================= CURRENT USER ================= */

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        User user;

        // Email/password login
        if (authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        }
        // OAuth login
        else if (authentication.getPrincipal() instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");
            user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            return ResponseEntity.status(401).build();
        }

        UserMeResponse response = new UserMeResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRoles()
                .stream()
                .map(role -> role.getName())
                .toList()
        );

        return ResponseEntity.ok(response);
    }


    /* ================= LOGOUT ================= */


}
