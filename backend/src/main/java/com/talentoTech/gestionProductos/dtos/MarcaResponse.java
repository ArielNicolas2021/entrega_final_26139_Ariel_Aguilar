package com.talentoTech.gestionProductos.dtos;

import java.util.List;

public record MarcaResponse(
    Long id,
    String nombre,
    List<CategoriaSummaryResponse> categorias) {
}