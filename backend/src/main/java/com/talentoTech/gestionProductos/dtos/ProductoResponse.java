package com.talentoTech.gestionProductos.dtos;

public record ProductoResponse(
    Long id,
    String nombre,
    String codigo,
    Double costo,
    Double precioVenta,
    Integer stock,
    String imagenUrl,
    Boolean activo,
    String categoria,
    String marca) {
}