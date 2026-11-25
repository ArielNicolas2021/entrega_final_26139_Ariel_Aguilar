package com.talentoTech.gestionProductos.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.talentoTech.gestionProductos.dtos.CategoriaSummaryResponse;
import com.talentoTech.gestionProductos.dtos.MarcaRequest;
import com.talentoTech.gestionProductos.dtos.MarcaResponse;
import com.talentoTech.gestionProductos.models.Categoria;
import com.talentoTech.gestionProductos.models.Marca;

@Mapper(componentModel = "spring")
public interface MarcaMapper {

  MarcaResponse toDTO(Marca marca);

  CategoriaSummaryResponse toCategoriaSummary(Categoria categoria);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "productos", ignore = true)
  @Mapping(target = "categorias", ignore = true)
  Marca toEntity(MarcaRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "productos", ignore = true)
  @Mapping(target = "categorias", ignore = true)
  void updateEntityFromRequest(MarcaRequest request, @MappingTarget Marca marca);
}