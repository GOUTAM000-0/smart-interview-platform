package com.example.loginsystem.config;

import com.example.loginsystem.security.JwtAuthenticationEntryPoint;
import com.example.loginsystem.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


import org.springframework.security.config.Customizer;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))

                .authorizeHttpRequests(auth -> auth

                        // ===========================
                        // Candidate Authentication APIs
                        // ===========================
                        .requestMatchers(

                                "/",
                                "/api/users/register",
                                "/api/users/login",
                                "/api/users/forgot-password",
                                "/api/users/verify-otp",
                                "/api/users/reset-password",
                                "/api/users/verify-registration"
                        ).permitAll()

                        // ===========================
                        // Interviewer Authentication APIs
                        // ===========================
                        .requestMatchers(

                                "/",
                                "/api/interviewers/register",
                                "/api/interviewers/login",
                                "/api/interviewers/forgot-password",
                                "/api/interviewers/verify-otp",
                                "/api/interviewers/reset-password",
                                "/api/interviewers/verify-registration",
                                "/api/ai/generate-questions",
                                "/api/ai/generate-from-resume"
                        ).permitAll()

                        // ===========================
                        // Candidate Protected APIs
                        // ===========================
                        .requestMatchers("/api/candidate/**")
                        .hasRole("CANDIDATE")

                        // ===========================
                        // Interviewer Protected APIs
                        // ===========================
                        .requestMatchers("/api/interviewer/**")
                        .hasRole("INTERVIEWER")

                        // ===========================
                        // Shared Dashboard
                        // ===========================


                        .requestMatchers(
                                "/ws/**",
                                "/ws",
                                "/topic/**",
                                "/app/**"
                        ).permitAll()



                        .requestMatchers("/api/dashboard")
                        .authenticated()

                        // ===========================
                        // Everything Else
                        // ===========================
                        .anyRequest()
                        .authenticated()

                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173" , "https://smartinterviewsystemm.netlify.app")
        );

        configuration.setAllowedMethods(
                List.of("*")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}