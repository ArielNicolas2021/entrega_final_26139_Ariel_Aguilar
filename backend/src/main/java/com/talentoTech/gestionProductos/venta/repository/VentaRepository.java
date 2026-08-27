package com.talentoTech.gestionProductos.venta.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.venta.model.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {
  List<Venta> findByUsuario(Usuario usuario);
  Optional<Venta> findByIdAndUsuario(Long id, Usuario usuario);
}