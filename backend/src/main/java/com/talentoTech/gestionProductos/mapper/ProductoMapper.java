package com.talentoTech.gestionProductos.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.talentoTech.gestionProductos.dtos.ProductoRequest;
import com.talentoTech.gestionProductos.dtos.ProductoResponse;
import com.talentoTech.gestionProductos.models.Producto;

@Mapper(componentModel = "spring")
public interface ProductoMapper {

  @Mapping(source = "categoria.nombre", target = "categoria")
  @Mapping(source = "marca.nombre", target = "marca")
  ProductoResponse toDTO(Producto producto);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "categoria", ignore = true)
  @Mapping(target = "marca", ignore = true)
  @Mapping(target = "activo", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(source = "costo", target = "costo", defaultValue = "0.0")
  Producto toEntity(ProductoRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "categoria", ignore = true)
  @Mapping(target = "marca", ignore = true)
  @Mapping(target = "activo", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(source = "costo", target = "costo", defaultValue = "0.0")
  void updateEntityFromRequest(ProductoRequest request, @MappingTarget Producto producto);
}