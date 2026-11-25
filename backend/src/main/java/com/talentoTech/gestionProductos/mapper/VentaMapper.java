package com.talentoTech.gestionProductos.mapper;

import org.mapstruct.Mapper;

import com.talentoTech.gestionProductos.dtos.VentaResponse;
import com.talentoTech.gestionProductos.models.Venta;

@Mapper(componentModel = "spring", uses = {DetalleVentaMapper.class})
public interface VentaMapper {
  VentaResponse toDTO(Venta venta);
}
