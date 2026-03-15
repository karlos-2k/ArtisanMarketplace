package com.artisans;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.artisans.entity.Role;
import com.artisans.entity.User;
import com.artisans.repository.RoleRepository;
import com.artisans.repository.UserRepository;
import com.artisans.security.JwtUtil;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final JwtUtil jwtUtil;

    public OAuth2SuccessHandler(
        UserRepository userRepo,
        RoleRepository roleRepo,
        JwtUtil jwtUtil) {

        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication auth) throws IOException {

        OAuth2User oAuthUser = (OAuth2User) auth.getPrincipal();

        String email = oAuthUser.getAttribute("email");
        String name = oAuthUser.getAttribute("name");

        User user = userRepo.findByEmail(email)
            .orElseGet(() -> {
                Role buyer = roleRepo
                    .findByName("ROLE_CUSTOMER").orElseThrow();

                User u = new User();
                u.setName(name);
                u.setEmail(email);
                u.setPassword("GOOGLE_AUTH");
                u.setRoles(List.of(buyer));
                return userRepo.save(u);
            });

        String jwt = jwtUtil.generateToken(user);

        Cookie cookie = new Cookie("jwt", jwt);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(86400);
        response.addCookie(cookie);

        try {
			response.sendRedirect("http://localhost:3000");
		} catch (java.io.IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}

