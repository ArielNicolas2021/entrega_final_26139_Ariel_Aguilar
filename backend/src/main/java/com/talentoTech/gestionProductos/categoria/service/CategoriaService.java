package com.talentoTech.gestionProductos.categoria.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;
import com.talentoTech.gestionProductos.categoria.dto.CategoriaDTO;
import com.talentoTech.gestionProductos.categoria.dto.CategoriaDeleteDTO;
import com.talentoTech.gestionProductos.categoria.model.Categoria;
import com.talentoTech.gestionProductos.categoria.repository.CategoriaRepository;
import com.talentoTech.gestionProductos.mapper.Mapper;

@Service
public class CategoriaService implements ICategoriaService {
  @Autowired
  private CategoriaRepository categoriaRepository;

  @Autowired
  private UsuarioRepository usuarioRepository;

  // Obtener todas las categorias
  public List<CategoriaDTO> readCategorias(Authentication auth) {
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());
    return categoriaRepository.findByUsuario(usuario).stream().map(Mapper::toDTO).toList();
  }

  // Obtener una categoria por su id
  public CategoriaDTO readCategoriaById(Long id, Authentication auth) {
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());
    Categoria categoria = categoriaRepository.findByIdAndUsuario(id, usuario).orElseThrow(() -> new RuntimeException("Categoría no encontrada."));
    return Mapper.toDTO(categoria);
  }

  // Crear categoria
  public CategoriaDTO createCategoria(CategoriaDTO categoria, Authentication auth) {

    Usuario usuario = usuarioRepository.findByEmail(auth.getName());

    Categoria newCategoria = new Categoria();
    newCategoria.setNombre(categoria.getNombre());
    newCategoria.setDescripcion(categoria.getDescripcion());
    newCategoria.setUsuario(usuario);

    Categoria saveCategoria = categoriaRepository.save(newCategoria);

    return Mapper.toDTO(saveCategoria);
  }

  // Eliminar categoria
  public CategoriaDeleteDTO deleteCategoria(Long id, Authentication auth) {
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());

    Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    
    if (!categoria.getUsuario().getId().equals(usuario.getId())) {
      throw new RuntimeException("No tienes permiso para eliminar este producto");
    }
    categoriaRepository.deleteById(id);
    return CategoriaDeleteDTO.builder()
      .status(200)
      .message("Categoría eliminada correctamente")
      .build();
  }

  // Modificar categoría
  public CategoriaDTO updateCategoria(Long id, CategoriaDTO cat, Authentication auth) {
    Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());

    categoria.setNombre(cat.getNombre());
    categoria.setDescripcion(cat.getDescripcion());
    categoria.setUsuario(usuario);
    
    Categoria saveCategoria = categoriaRepository.save(categoria);
    return Mapper.toDTO(saveCategoria);
  }
}
