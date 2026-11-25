package com.talentoTech.gestionProductos.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // Desactiva la protección CSRF (común en APIs REST)
        .csrf(csrf -> csrf.disable())

        // Permite el acceso a TODAS las rutas sin contraseña
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll());

    return http.build();
  }
}