package com.talentoTech.gestionProductos.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.talentoTech.gestionProductos.dtos.MarcaRequest;
import com.talentoTech.gestionProductos.dtos.MarcaResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;

public interface IMarcaService {
  Page<MarcaResponse> getMarcas(Pageable pageable);

  MarcaResponse getMarcaById(Long id);

  MarcaResponse createMarca(MarcaRequest marca);

  StatusResponse deleteMarca(Long id);

  MarcaResponse updateMarca(Long id, MarcaRequest marca);

  List<MarcaResponse> getMarcasByCategoriaId(Long categoriaId);
}
