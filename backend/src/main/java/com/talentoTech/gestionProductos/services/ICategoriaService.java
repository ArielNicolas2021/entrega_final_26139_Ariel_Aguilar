package com.talentoTech.gestionProductos.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.talentoTech.gestionProductos.dtos.CategoriaRequest;
import com.talentoTech.gestionProductos.dtos.CategoriaResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;

public interface ICategoriaService {
  Page<CategoriaResponse> getCategories(Pageable pageable);

  CategoriaResponse getCategoryById(Long id);

  CategoriaResponse createCategory(CategoriaRequest categoria);

  StatusResponse deleteCategory(Long id);

  CategoriaResponse updateCategory(Long id, CategoriaRequest categoria);
}
