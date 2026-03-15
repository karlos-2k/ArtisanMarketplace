package com.artisans.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.artisans.entity.Role;
import com.artisans.entity.User;
import com.artisans.repository.RoleRepository;
import com.artisans.repository.UserRepository;
import com.artisans.security.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth/google")
public class GoogleAuthController {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final JwtUtil jwtUtil;

    public GoogleAuthController(
            UserRepository userRepo,
            RoleRepository roleRepo,
            JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/assign-role")
    public ResponseEntity<?> assignRole(
            @RequestBody Map<String, String> body,
            Authentication authentication,
            HttpServletResponse response) {

        if (!(authentication.getPrincipal() instanceof OAuth2User oauthUser)) {
            return ResponseEntity.status(401).build();
        }

        String roleValue = body.get("role"); // artisan / consumer
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        User user = userRepo.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName(name);
            u.setPassword("GOOGLE_AUTH");
            u.setEnabled(true);
            return userRepo.save(u);
        });

        Role role = roleRepo.findByName(
                roleValue.equals("artisan")
                        ? "ROLE_SELLER"
                        : "ROLE_CUSTOMER"
        ).orElseThrow();

        // ✅ MUTABLE COLLECTION HANDLING
        user.getRoles().clear();
        user.getRoles().add(role);
        userRepo.save(user);

        String jwt = jwtUtil.generateToken(user);

        Cookie cookie = new Cookie("jwt", jwt);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(86400);
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }

}
