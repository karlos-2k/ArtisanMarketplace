package com.artisans.security;

import java.util.List;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.artisans.entity.ArtisanProfile;
import com.artisans.entity.Role;
import com.artisans.entity.User;
import com.artisans.repository.ArtisanProfileRepository;
import com.artisans.repository.RoleRepository;
import com.artisans.repository.UserRepository;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final ArtisanProfileRepository artisanRepo;
    private final JwtUtil jwtUtil;

    public SecurityConfig(
            JwtAuthenticationFilter jwtFilter,
            UserRepository userRepo,
            RoleRepository roleRepo,
            ArtisanProfileRepository artisanRepo,
            JwtUtil jwtUtil) {

        this.jwtFilter = jwtFilter;
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.artisanRepo = artisanRepo;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())

            /* ================= AUTH ================= */
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/auth/login",
                    "/auth/register/**",
                    "/auth/set-role",
                    "/oauth2/**",
                    "/api/wishlist/",
                    "/api/cart/**",
                    "/api/stories/**",
                    "/api/products/**",
                    "/api/reviews/**",
                    "/api/payment/**",
                    "/api/orders/**"
                ).permitAll()

                .requestMatchers("/auth/me").authenticated()
                .requestMatchers("/auth/logout").authenticated()
                .requestMatchers("/api/seller/**").hasRole("SELLER")
                .requestMatchers(HttpMethod.POST, "/api/stories")
                .hasRole("SELLER")
                .anyRequest().authenticated()
            )

            /* ===== Prevent Google redirect for APIs ===== */
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"Unauthorized\"}");
                })
            )

            /* ================= GOOGLE LOGIN ================= */
            .oauth2Login(oauth -> oauth
                .successHandler((request, response, authentication) -> {

                    OAuth2User oauthUser =
                            (OAuth2User) authentication.getPrincipal();

                    String email = oauthUser.getAttribute("email");
                    String name  = oauthUser.getAttribute("name");

                    String selectedRole =
                        (String) request.getSession()
                                .getAttribute("OAUTH_ROLE");

                    if (selectedRole == null) {
                        response.sendRedirect("http://localhost:3000/role");
                        return;
                    }

                    Role role = roleRepo.findByName(selectedRole)
                            .orElseThrow(() ->
                                new RuntimeException("ROLE NOT FOUND"));

                    User user = userRepo.findByEmail(email)
                            .orElseGet(() -> {
                                User u = new User();
                                u.setEmail(email);
                                u.setName(name);
                                u.setPassword("GOOGLE_AUTH");
                                u.setEnabled(true);
                                u.setRoles(List.of(role));
                                return userRepo.save(u);
                            });

                    if (selectedRole.equals("ROLE_SELLER")) {
                        artisanRepo.findByUser(user)
                                .orElseGet(() -> {
                                    ArtisanProfile ap = new ArtisanProfile();
                                    ap.setUser(user);
                                    ap.setBio("");
                                    return artisanRepo.save(ap);
                                });
                    }

                    /* 🔥 CRITICAL FIX */
                    var authToken =
                        new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            user.getAuthorities()
                        );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);

                    String jwt = jwtUtil.generateToken(user);

                    response.addHeader(
                        "Set-Cookie",
                        "jwt=" + jwt +
                        "; Path=/" +
                        "; HttpOnly" +
                        "; Max-Age=86400"
                    );

                    request.getSession()
                           .removeAttribute("OAUTH_ROLE");

                    response.sendRedirect(
                        selectedRole.equals("ROLE_SELLER")
                            ? "http://localhost:3000/seller"
                            : "http://localhost:3000/"
                    );
                })
            )

            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    /* ================= BEANS ================= */

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
