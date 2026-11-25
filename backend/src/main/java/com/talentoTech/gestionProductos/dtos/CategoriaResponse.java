package com.talentoTech.gestionProductos.dtos;

import java.util.List;

public record CategoriaResponse(
    Long id,
    String nombre,
    String descripcion,
    List<MarcaResponse> marcas) {
}