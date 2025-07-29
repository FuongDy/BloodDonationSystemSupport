package com.hicode.backend.config;

import com.hicode.backend.security.JwtAuthenticationEntryPoint;
import com.hicode.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // API công khai
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blood-types", "/api/blood-types/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blood-compatibility/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blog-posts", "/api/blog-posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blood-requests/search/active").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/blood-requests/{id}/pledge").hasAnyRole("MEMBER", "ADMIN")
                        
                        // Chỉ ADMIN mới được truy cập
                        .requestMatchers("/api/admin/users/**").hasRole("ADMIN")           // Quản lí người dùng
                        .requestMatchers("/api/admin/blog-posts/**").hasRole("ADMIN")     // Quản lí blog  
                        .requestMatchers("/api/admin/reports/**").hasRole("ADMIN")        // Báo cáo hệ thống
                        
                        // ADMIN và STAFF đều được truy cập
                        .requestMatchers("/api/admin/dashboard/**").hasAnyRole("ADMIN", "STAFF")          // Dashboard
                        .requestMatchers("/api/admin/blood-requests/**").hasAnyRole("ADMIN", "STAFF")     // Quản lí yêu cầu máu khẩn cấp
                        .requestMatchers("/api/admin/donation-process/**").hasAnyRole("ADMIN", "STAFF")   // Quy trình hiến máu
                        .requestMatchers("/api/admin/donation-history/**").hasAnyRole("ADMIN", "STAFF")  // Quản lý lịch sử hiến máu
                        .requestMatchers("/api/admin/inventory/**").hasAnyRole("ADMIN", "STAFF")         // Quản lí kho máu
                        .requestMatchers("/api/admin/donors/**").hasAnyRole("ADMIN", "STAFF")            // Tìm người hiến máu
                        
                        // Fallback cho các admin endpoints khác (ADMIN và STAFF)
                        .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers("/api/staff/**").hasRole("STAFF")
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}