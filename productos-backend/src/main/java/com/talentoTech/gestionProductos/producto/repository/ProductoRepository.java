package com.talentoTech.gestionProductos.producto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.talentoTech.gestionProductos.producto.model.ProductoModel;

@Repository
public interface ProductoRepository extends JpaRepository<ProductoModel, Long> {
}
