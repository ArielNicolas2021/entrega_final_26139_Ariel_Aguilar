package com.talentoTech.gestionProductos.dtos;

public record DetalleVentaResponse(
    Long id,
    int cantidad,
    double precioVenta,
    double subtotal,
    Long productoID,
    Long ventaID) {
}
