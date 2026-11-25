package com.talentoTech.gestionProductos.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.talentoTech.gestionProductos.models.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

  @Override
  @EntityGraph(attributePaths = { "marcas" })
  Page<Categoria> findAll(Pageable pageable);

  @Override
  @EntityGraph(attributePaths = { "marcas" })
  Optional<Categoria> findById(Long id);

  boolean existsByNombreIgnoreCase(String nombre);
}