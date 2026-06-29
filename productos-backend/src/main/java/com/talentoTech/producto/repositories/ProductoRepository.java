package com.talentoTech.producto.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.talentoTech.producto.models.ProductoModel;

@Repository
public interface ProductoRepository extends CrudRepository<ProductoModel, Long> {
}
