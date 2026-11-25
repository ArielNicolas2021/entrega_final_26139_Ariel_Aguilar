package com.talentoTech.gestionProductos.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record StockRequest(
    @NotNull(message = "El stock no puede ser nulo") @PositiveOrZero(message = "El stock debe ser mayor o igual a 0") Integer stock) {
}