package com.talentoTech.gestionProductos.categoria.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.talentoTech.gestionProductos.categoria.dto.CategoriaDTO;
import com.talentoTech.gestionProductos.categoria.dto.CategoriaDeleteDTO;

public interface ICategoriaService {
  List<CategoriaDTO> readCategorias(Authentication auth);
  CategoriaDTO readCategoriaById(Long id, Authentication auth);
  CategoriaDTO createCategoria(CategoriaDTO categoriaDto, Authentication auth);
  CategoriaDeleteDTO deleteCategoria(Long id, Authentication auth);
  CategoriaDTO updateCategoria(Long id, CategoriaDTO categoriaDto, Authentication auth);
}
