package com.talentoTech.gestionProductos.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.talentoTech.gestionProductos.models.Notificacion;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

  @EntityGraph(attributePaths = { "producto" })
  List<Notificacion> findByLeidaFalseOrderByFechaCreacionDesc();

  @EntityGraph(attributePaths = { "producto" })
  List<Notificacion> findTop20ByOrderByFechaCreacionDesc();

  long countByLeidaFalse();

  @Modifying
  @Query("UPDATE Notificacion n SET n.leida = true WHERE n.leida = false")
  int marcarTodasComoLeidas();
}