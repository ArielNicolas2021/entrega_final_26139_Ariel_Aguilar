package com.talentoTech.gestionProductos.dtos;

import java.time.LocalDateTime;
import com.talentoTech.gestionProductos.models.TipoNotificacion;

public record NotificacionResponse(
    Long id,
    TipoNotificacion tipo,
    String titulo,
    String mensaje,
    Boolean leida,
    LocalDateTime fechaCreacion,
    Long productoId,
    String productoNombre) {
}