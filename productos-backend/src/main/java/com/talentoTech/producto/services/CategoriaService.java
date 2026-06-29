package com.talentoTech.producto.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.talentoTech.producto.dto.CategoriaRequest;
import com.talentoTech.producto.models.CategoriaModel;
import com.talentoTech.producto.repositories.CategoriaRepository;

@Service
public class CategoriaService {
  @Autowired
  CategoriaRepository categoriaRepository;

  // Obtener todas las categorias
  public ArrayList<CategoriaModel> getCategorias() {
    return (ArrayList<CategoriaModel>) categoriaRepository.findAll();
  }

  // Obtener una categoria por su id
  public CategoriaModel getCategoriaById(Long id) {
    return categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoría no encontrada."));
  }

  // Crear categoria
  public CategoriaModel createCategoria(CategoriaRequest request) {
    CategoriaModel categoria = new CategoriaModel();
    categoria.setNombre(request.getNombre());
    categoria.setDescripcion(request.getDescripcion());
    return categoriaRepository.save(categoria);
  }

  // Eliminar categoria
  public String deleteCategoria(Long id) {
    categoriaRepository.deleteById(id);
    return "Categoría eliminada correctamente.";
  }

  // Modificar categoría
  public Optional<CategoriaModel> updateCategoria(Long id, CategoriaRequest request) {
    Optional<CategoriaModel> categoriaData = categoriaRepository.findById(id);

    if (categoriaData.isPresent()) {
      CategoriaModel categoria = categoriaData.get();

      if (request.getNombre() != null) { categoria.setNombre(request.getNombre()); }
      if (request.getDescripcion() != null) { categoria.setDescripcion(request.getDescripcion()); }

      return Optional.of(categoriaRepository.save(categoria));
    } else {
      return Optional.empty();
    }
  }
}
