package com.talentoTech.gestionProductos.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.talentoTech.gestionProductos.models.Marca;

public interface MarcaRepository extends JpaRepository<Marca, Long> {

  @Override
  @EntityGraph(attributePaths = { "categorias" })
  Page<Marca> findAll(Pageable pageable);

  @Override
  @EntityGraph(attributePaths = { "categorias" })
  Optional<Marca> findById(Long id);

  @EntityGraph(attributePaths = { "categorias" })
  List<Marca> findByCategoriasIdOrderByNombreAsc(Long categoriaId);

  boolean existsByNombreIgnoreCase(String nombre);
}