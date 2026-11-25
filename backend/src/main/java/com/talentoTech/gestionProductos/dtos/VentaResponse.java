package com.talentoTech.gestionProductos.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.talentoTech.gestionProductos.models.EstadoVenta;

public record VentaResponse(
    Long id,
    LocalDateTime fecha,
    String metodoPago,
    EstadoVenta estado,
    Double total,
    List<DetalleVentaResponse> detalleVenta) {
}