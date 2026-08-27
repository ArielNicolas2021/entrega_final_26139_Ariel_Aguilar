package com.talentoTech.gestionProductos.detalle_venta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.detalle_venta.model.DetalleVenta;


@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
  List<DetalleVenta> findByUsuario(Usuario usuario);
  List<DetalleVenta> findByVentaIdAndUsuario(Long id, Usuario usuario);
}
