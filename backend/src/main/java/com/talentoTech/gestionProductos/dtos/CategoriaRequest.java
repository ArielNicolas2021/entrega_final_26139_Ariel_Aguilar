package com.talentoTech.gestionProductos.dtos;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequest(
    @NotBlank(message = "El nombre no puede estar vacío") String nombre,
    String descripcion) {
}
