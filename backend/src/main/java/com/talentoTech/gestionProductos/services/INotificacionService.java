package com.talentoTech.gestionProductos.services;

import java.util.List;
import com.talentoTech.gestionProductos.dtos.NotificacionResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;

public interface INotificacionService {
  List<NotificacionResponse> getNoLeidas();

  List<NotificacionResponse> getRecientes();

  long countNoLeidas();

  StatusResponse marcarComoLeida(Long id);

  StatusResponse marcarTodasComoLeidas();
}