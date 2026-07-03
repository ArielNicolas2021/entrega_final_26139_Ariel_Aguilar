package com.talentoTech.gestionProductos.categoria.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.talentoTech.gestionProductos.categoria.model.CategoriaModel;

@Repository
public interface CategoriaRepository extends CrudRepository<CategoriaModel, Long> {
}
