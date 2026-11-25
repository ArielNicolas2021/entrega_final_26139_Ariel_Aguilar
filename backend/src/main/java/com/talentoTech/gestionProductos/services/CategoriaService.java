package com.talentoTech.gestionProductos.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.talentoTech.gestionProductos.dtos.CategoriaRequest;
import com.talentoTech.gestionProductos.dtos.CategoriaResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.mapper.CategoriaMapper;
import com.talentoTech.gestionProductos.models.Categoria;
import com.talentoTech.gestionProductos.repositories.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaService implements ICategoriaService {

  private final CategoriaRepository categoriaRepository;
  private final CategoriaMapper categoriaMapper;

  // Obtener todas las categorias
  @Override
  @Transactional(readOnly = true)
  public Page<CategoriaResponse> getCategories(Pageable pageable) {
    return categoriaRepository.findAll(pageable).map(categoriaMapper::toDTO);
  }

  // Obtener una categoria por su id
  @Override
  @Transactional(readOnly = true)
  public CategoriaResponse getCategoryById(Long id) {
    Categoria categoria = categoriaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    return categoriaMapper.toDTO(categoria);
  }

  // Crear categoria
  @Override
  @Transactional
  public CategoriaResponse createCategory(CategoriaRequest cat) {
    if (categoriaRepository.existsByNombreIgnoreCase(cat.nombre())) {
      throw new RuntimeException("Ya existe una categoría con el nombre: " + cat.nombre());
    }

    Categoria categoria = categoriaMapper.toEntity(cat);
    Categoria savedCategoria = categoriaRepository.save(categoria);

    return categoriaMapper.toDTO(savedCategoria);
  }

  // Eliminar categoria
  @Override
  @Transactional
  public StatusResponse deleteCategory(Long id) {
    Categoria categoria = categoriaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    if (!categoria.getProductos().isEmpty()) {
      throw new RuntimeException("No se puede eliminar la categoría porque tiene productos asociados");
    }

    categoriaRepository.delete(categoria);
    return StatusResponse.builder()
        .status(200)
        .message("Categoría eliminada correctamente")
        .build();
  }

  // Modificar categoría
  @Override
  @Transactional
  public CategoriaResponse updateCategory(Long id, CategoriaRequest cat) {
    Categoria categoria = categoriaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    if (!categoria.getNombre().equalsIgnoreCase(cat.nombre())
        && categoriaRepository.existsByNombreIgnoreCase(cat.nombre())) {
      throw new RuntimeException("Ya existe otra categoría con el nombre: " + cat.nombre());
    }

    categoriaMapper.updateEntityFromRequest(cat, categoria);
    Categoria savedCategoria = categoriaRepository.save(categoria);

    return categoriaMapper.toDTO(savedCategoria);
  }
}