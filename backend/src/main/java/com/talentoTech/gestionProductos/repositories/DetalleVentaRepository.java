package com.talentoTech.gestionProductos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.talentoTech.gestionProductos.models.DetalleVenta;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
}
