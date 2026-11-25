package com.talentoTech.gestionProductos.dtos;

import java.util.List;

public record DashboardResponse(
    String periodo,
    Double totalVentas,
    Long totalTransacciones,
    List<ProductoGanadorResponse> productosGanadores) {
}