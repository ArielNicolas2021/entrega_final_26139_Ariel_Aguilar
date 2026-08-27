package com.talentoTech.gestionProductos.categoria.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.categoria.model.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
  List<Categoria> findByUsuario(Usuario usuario);
  Optional<Categoria> findByIdAndUsuario(Long id, Usuario usuario);
}
