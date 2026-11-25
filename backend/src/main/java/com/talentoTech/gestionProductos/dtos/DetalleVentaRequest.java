package com.talentoTech.gestionProductos.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DetalleVentaRequest(
    @Positive(message = "La cantidad debe ser mayor a 0") int cantidad,
    @NotNull(message = "El producto es obligatorio") Long productoID) {
}
