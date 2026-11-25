// NotificacionService.java
package com.talentoTech.gestionProductos.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.talentoTech.gestionProductos.dtos.NotificacionResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.models.Notificacion;
import com.talentoTech.gestionProductos.repositories.NotificacionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificacionService implements INotificacionService {

  private final NotificacionRepository notificacionRepository;

  @Override
  @Transactional(readOnly = true)
  public List<NotificacionResponse> getNoLeidas() {
    return notificacionRepository.findByLeidaFalseOrderByFechaCreacionDesc().stream()
        .map(this::toDTO)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<NotificacionResponse> getRecientes() {
    return notificacionRepository.findTop20ByOrderByFechaCreacionDesc().stream()
        .map(this::toDTO)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public long countNoLeidas() {
    return notificacionRepository.countByLeidaFalse();
  }

  @Override
  @Transactional
  public StatusResponse marcarComoLeida(Long id) {
    Notificacion notificacion = notificacionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));

    notificacion.setLeida(true);
    notificacionRepository.save(notificacion);

    return StatusResponse.builder()
        .status(200)
        .message("Notificación marcada como leída")
        .build();
  }

  @Override
  @Transactional
  public StatusResponse marcarTodasComoLeidas() {
    notificacionRepository.marcarTodasComoLeidas();
    return StatusResponse.builder()
        .status(200)
        .message("Todas las notificaciones fueron marcadas como leídas")
        .build();
  }

  private NotificacionResponse toDTO(Notificacion n) {
    return new NotificacionResponse(
        n.getId(),
        n.getTipo(),
        n.getTitulo(),
        n.getMensaje(),
        n.getLeida(),
        n.getFechaCreacion(),
        n.getProducto().getId(),
        n.getProducto().getNombre());
  }
}