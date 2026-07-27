package com.talentoTech.gestionProductos.categoria.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.auth.model.UsuarioModel;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;
import com.talentoTech.gestionProductos.categoria.dto.CategoriaRequest;
import com.talentoTech.gestionProductos.categoria.model.CategoriaModel;
import com.talentoTech.gestionProductos.categoria.repository.CategoriaRepository;

@Service
public class CategoriaService {
  @Autowired
  CategoriaRepository categoriaRepository;

  @Autowired
  UsuarioRepository usuarioRepository;

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
    UsuarioModel usuario = usuarioRepository
        .findById(request.getUsuario())
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    CategoriaModel categoria = new CategoriaModel();
    categoria.setNombre(request.getNombre());
    categoria.setDescripcion(request.getDescripcion());
    categoria.setUsuario(usuario);

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

      if (request.getNombre() != null) {
        categoria.setNombre(request.getNombre());
      }
      if (request.getDescripcion() != null) {
        categoria.setDescripcion(request.getDescripcion());
      }
      if (request.getUsuario() != null) {
        UsuarioModel usuario = usuarioRepository
            .findById(request.getUsuario())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        categoria.setUsuario(usuario);
      }

      return Optional.of(categoriaRepository.save(categoria));
    } else {
      return Optional.empty();
    }
  }
}
