package com.talentoTech.gestionProductos.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.talentoTech.gestionProductos.models.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

  @Override
  @EntityGraph(attributePaths = { "categoria", "marca" })
  Page<Producto> findAll(Pageable pageable);

  boolean existsByCodigo(String codigo);
}