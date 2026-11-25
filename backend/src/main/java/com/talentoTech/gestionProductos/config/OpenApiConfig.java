package com.talentoTech.gestionProductos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(new Info()
            .title("API Gestión de Productos y Ventas")
            .version("1.0.0")
            .description("Documentación REST para el catálogo de productos, categorías, marcas y ventas.")
            .contact(new Contact()
                .name("TalentoTech")
                .email("soporte@talentotech.com")));
  }
}