package com.talentoTech.gestionProductos.dtos;

import lombok.Builder;

@Builder
public record StatusResponse(
    int status,
    String message) {
}
