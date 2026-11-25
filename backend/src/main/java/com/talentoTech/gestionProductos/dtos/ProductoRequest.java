package com.talentoTech.gestionProductos.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductoRequest(

    @NotBlank(message = "El nombre no puede estar vacío") String nombre,

    @NotBlank(message = "El código no puede estar vacío") String codigo,

    @PositiveOrZero(message = "El costo debe ser mayor o igual a 0") Double costo,

    @NotNull(message = "El precio no puede ser nulo") @Positive(message = "El precio debe ser mayor a 0") Double precioVenta,

    @NotNull(message = "El stock no puede ser nulo") @PositiveOrZero(message = "El stock debe ser mayor o igual a 0") Integer stock,

    String imagenUrl,

    @NotNull(message = "La categoría no puede ser nula") @Positive(message = "El ID de categoría debe ser válido") Long categoriaID,

    @Positive(message = "El ID de marca debe ser válido") Long marcaID) {
}