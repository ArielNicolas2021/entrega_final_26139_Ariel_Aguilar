package com.talentoTech.gestionProductos.events;

import com.talentoTech.gestionProductos.models.Producto;

public record StockActualizadoEvent(
    Producto producto,
    int stockAnterior,
    int stockNuevo) {
}