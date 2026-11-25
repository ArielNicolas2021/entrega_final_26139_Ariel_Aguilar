package com.talentoTech.gestionProductos.dtos;

public record ProductoGanadorResponse(
    Long productoId,
    String nombre,
    Long unidadesVendidas,
    Double ingresosGenerados) {
}