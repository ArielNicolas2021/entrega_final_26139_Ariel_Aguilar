package com.talentoTech.gestionProductos.producto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.producto.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
  List<Producto> findByUsuario(Usuario usuario);
  Optional<Producto> findByIdAndUsuario(Long id, Usuario usuario);
}
