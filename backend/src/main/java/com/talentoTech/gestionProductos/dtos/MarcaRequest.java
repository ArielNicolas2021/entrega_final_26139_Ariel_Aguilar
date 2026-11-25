package com.talentoTech.gestionProductos.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MarcaRequest(
    @NotBlank(message = "El nombre no puede estar vacío") String nombre,

    @NotNull(message = "La categoría no puede ser nula") @Positive(message = "El ID de categoría debe ser válido") Long categoriaID) {
}