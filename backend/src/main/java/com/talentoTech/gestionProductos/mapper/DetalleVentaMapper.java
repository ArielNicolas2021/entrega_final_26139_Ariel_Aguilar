package com.talentoTech.gestionProductos.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.talentoTech.gestionProductos.dtos.DetalleVentaResponse;
import com.talentoTech.gestionProductos.models.DetalleVenta;

@Mapper(componentModel = "spring")
public interface DetalleVentaMapper {

  @Mapping(source = "producto.id", target = "productoID")
  @Mapping(source = "venta.id", target = "ventaID")
  DetalleVentaResponse toDTO(DetalleVenta detalleVenta);
}
