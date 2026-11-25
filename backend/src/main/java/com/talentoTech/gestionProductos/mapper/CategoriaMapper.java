package com.talentoTech.gestionProductos.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.talentoTech.gestionProductos.dtos.CategoriaRequest;
import com.talentoTech.gestionProductos.dtos.CategoriaResponse;
import com.talentoTech.gestionProductos.models.Categoria;

@Mapper(componentModel = "spring", uses = { MarcaMapper.class })
public interface CategoriaMapper {

  CategoriaResponse toDTO(Categoria categoria);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "productos", ignore = true)
  @Mapping(target = "marcas", ignore = true)
  Categoria toEntity(CategoriaRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "productos", ignore = true)
  @Mapping(target = "marcas", ignore = true)
  void updateEntityFromRequest(CategoriaRequest request, @MappingTarget Categoria categoria);
}