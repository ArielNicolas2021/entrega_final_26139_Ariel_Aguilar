package com.talentoTech.gestionProductos.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.talentoTech.gestionProductos.models.EstadoVenta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.PastOrPresent;

public record VentaRequest(
    @NotBlank(message = "El método de pago es obligatorio") String metodoPago,

    EstadoVenta estado,

    @PastOrPresent(message = "La fecha de la venta no puede ser futura") LocalDateTime fecha,

    @NotEmpty(message = "La venta debe contener al menos un producto") @Valid List<DetalleVentaRequest> detalleVenta) {
}