package com.talentoTech.gestionProductos.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.talentoTech.gestionProductos.dtos.ProductoGanadorResponse;
import com.talentoTech.gestionProductos.models.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {

  @Override
  @EntityGraph(attributePaths = { "detalleVenta", "detalleVenta.producto" })
  Page<Venta> findAll(Pageable pageable);

  @Query("""
      SELECT COALESCE(SUM(v.total), 0.0)
      FROM Venta v
      WHERE v.estado = com.talentoTech.gestionProductos.models.EstadoVenta.COMPLETADA
        AND v.fecha BETWEEN :inicio AND :fin
      """)
  Double sumTotalVentasByPeriodo(
      @Param("inicio") LocalDateTime inicio,
      @Param("fin") LocalDateTime fin);

  @Query("""
      SELECT COUNT(v)
      FROM Venta v
      WHERE v.estado = com.talentoTech.gestionProductos.models.EstadoVenta.COMPLETADA
        AND v.fecha BETWEEN :inicio AND :fin
      """)
  Long countVentasByPeriodo(
      @Param("inicio") LocalDateTime inicio,
      @Param("fin") LocalDateTime fin);

  @Query("""
      SELECT new com.talentoTech.gestionProductos.dtos.ProductoGanadorResponse(
          p.id,
          p.nombre,
          SUM(d.cantidad),
          SUM(d.subtotal)
      )
      FROM DetalleVenta d
      JOIN d.venta v
      JOIN d.producto p
      WHERE v.estado = com.talentoTech.gestionProductos.models.EstadoVenta.COMPLETADA
        AND v.fecha BETWEEN :inicio AND :fin
      GROUP BY p.id, p.nombre
      ORDER BY SUM(d.cantidad) DESC
      """)
  List<ProductoGanadorResponse> findTopProductosByPeriodo(
      @Param("inicio") LocalDateTime inicio,
      @Param("fin") LocalDateTime fin,
      Pageable pageable);
}