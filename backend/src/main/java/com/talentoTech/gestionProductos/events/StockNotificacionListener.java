package com.talentoTech.gestionProductos.events;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.talentoTech.gestionProductos.models.Notificacion;
import com.talentoTech.gestionProductos.models.Producto;
import com.talentoTech.gestionProductos.models.TipoNotificacion;
import com.talentoTech.gestionProductos.repositories.NotificacionRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class StockNotificacionListener {

  private static final int UMBRAL_STOCK_BAJO = 5;
  private final NotificacionRepository notificacionRepository;

  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void onStockActualizado(StockActualizadoEvent event) {
    int nuevo = event.stockNuevo();
    int anterior = event.stockAnterior();
    Producto producto = event.producto();

    // Solo notificar si el stock disminuyó (o es una creación inicial con stock
    // crítico)
    if (nuevo >= anterior) {
      return;
    }

    if (nuevo == 0) {
      crearNotificacion(
          producto,
          TipoNotificacion.SIN_STOCK,
          "Producto sin stock",
          String.format("El producto '%s' (Código: %s) se ha quedado sin unidades disponibles.",
              producto.getNombre(), producto.getCodigo()));
    } else if (nuevo <= UMBRAL_STOCK_BAJO && anterior > UMBRAL_STOCK_BAJO) {
      crearNotificacion(
          producto,
          TipoNotificacion.STOCK_BAJO,
          "Stock bajo",
          String.format("El producto '%s' (Código: %s) tiene solo %d unidades restantes.",
              producto.getNombre(), producto.getCodigo(), nuevo));
    }
  }

  private void crearNotificacion(Producto producto, TipoNotificacion tipo, String titulo, String mensaje) {
    Notificacion notificacion = Notificacion.builder()
        .producto(producto)
        .tipo(tipo)
        .titulo(titulo)
        .mensaje(mensaje)
        .leida(false)
        .build();

    notificacionRepository.save(notificacion);
  }
}