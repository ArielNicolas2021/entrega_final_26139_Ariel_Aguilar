// NotificacionController.java
package com.talentoTech.gestionProductos.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.talentoTech.gestionProductos.dtos.NotificacionResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.services.INotificacionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

  private final INotificacionService notificacionService;

  @GetMapping("/no-leidas")
  public ResponseEntity<List<NotificacionResponse>> getNoLeidas() {
    return ResponseEntity.ok(notificacionService.getNoLeidas());
  }

  @GetMapping
  public ResponseEntity<List<NotificacionResponse>> getRecientes() {
    return ResponseEntity.ok(notificacionService.getRecientes());
  }

  @GetMapping("/contador")
  public ResponseEntity<?> getContadorNoLeidas() {
    return ResponseEntity.ok(Map.of("noLeidas", notificacionService.countNoLeidas()));
  }

  @PatchMapping("/{id}/leer")
  public ResponseEntity<StatusResponse> marcarComoLeida(@PathVariable Long id) {
    return ResponseEntity.ok(notificacionService.marcarComoLeida(id));
  }

  @PatchMapping("/leer-todas")
  public ResponseEntity<StatusResponse> marcarTodasComoLeidas() {
    return ResponseEntity.ok(notificacionService.marcarTodasComoLeidas());
  }
}