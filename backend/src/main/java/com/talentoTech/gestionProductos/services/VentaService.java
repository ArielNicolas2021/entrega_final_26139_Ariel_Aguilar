package com.talentoTech.gestionProductos.services;

import java.time.LocalDateTime;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.talentoTech.gestionProductos.dtos.DetalleVentaRequest;
import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.dtos.VentaRequest;
import com.talentoTech.gestionProductos.dtos.VentaResponse;
import com.talentoTech.gestionProductos.events.StockActualizadoEvent;
import com.talentoTech.gestionProductos.mapper.VentaMapper;
import com.talentoTech.gestionProductos.models.DetalleVenta;
import com.talentoTech.gestionProductos.models.EstadoVenta;
import com.talentoTech.gestionProductos.models.Producto;
import com.talentoTech.gestionProductos.models.Venta;
import com.talentoTech.gestionProductos.repositories.ProductoRepository;
import com.talentoTech.gestionProductos.repositories.VentaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VentaService implements IVentaService {

  private final VentaRepository ventaRepository;
  private final VentaMapper ventaMapper;
  private final ProductoRepository productoRepository;
  private final ApplicationEventPublisher eventPublisher;

  /*
   * ===========================
   * Obtener todas las ventas
   * ===========================
   */
  @Override
  @Transactional(readOnly = true)
  public Page<VentaResponse> getVentas(Pageable pageable) {
    return ventaRepository.findAll(pageable).map(ventaMapper::toDTO);
  }

  /*
   * ===========================
   * Obtener una venta por su id
   * ===========================
   */
  @Override
  @Transactional(readOnly = true)
  public VentaResponse getVentaById(Long id) {
    Venta venta = ventaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

    return ventaMapper.toDTO(venta);
  }

  /*
   * ===========================
   * Crear una venta
   * ===========================
   */
  @Override
  @Transactional
  public VentaResponse createVenta(VentaRequest venta) {
    if (venta.estado() == EstadoVenta.CANCELADA) {
      throw new RuntimeException("No se puede registrar una venta nueva en estado CANCELADA");
    }

    Venta newVenta = new Venta();
    newVenta.setMetodoPago(venta.metodoPago());
    newVenta.setEstado(venta.estado() != null ? venta.estado() : EstadoVenta.COMPLETADA);
    newVenta.setFecha(venta.fecha() != null ? venta.fecha() : LocalDateTime.now());

    Venta saveVenta = ventaRepository.save(newVenta);

    double total = 0.0;
    for (DetalleVentaRequest detalleVenta : venta.detalleVenta()) {
      Producto producto = productoRepository.findById(detalleVenta.productoID())
          .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

      int stockAnterior = producto.getStock();

      if (stockAnterior < detalleVenta.cantidad()) {
        throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
      }

      DetalleVenta newDetalleVenta = new DetalleVenta();
      newDetalleVenta.setCantidad(detalleVenta.cantidad());
      newDetalleVenta.setPrecioVenta(producto.getPrecioVenta());
      newDetalleVenta.setSubtotal(detalleVenta.cantidad() * producto.getPrecioVenta());
      newDetalleVenta.setProducto(producto);
      newDetalleVenta.setVenta(saveVenta);

      saveVenta.getDetalleVenta().add(newDetalleVenta);

      int stockNuevo = stockAnterior - detalleVenta.cantidad();
      producto.setStock(stockNuevo);
      productoRepository.save(producto);

      eventPublisher.publishEvent(new StockActualizadoEvent(producto, stockAnterior, stockNuevo));

      total += newDetalleVenta.getSubtotal();
    }

    saveVenta.setTotal(total);
    saveVenta = ventaRepository.save(saveVenta);

    return ventaMapper.toDTO(saveVenta);
  }

  @Override
  @Transactional
  public VentaResponse updateEstadoVenta(Long id, EstadoVenta nuevoEstado) {
    Venta venta = ventaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

    if (venta.getEstado() == EstadoVenta.CANCELADA) {
      throw new RuntimeException("No se puede modificar el estado de una venta ya cancelada");
    }

    if (venta.getEstado() == nuevoEstado) {
      return ventaMapper.toDTO(venta);
    }

    // Si pasa a CANCELADA desde COMPLETADA o PENDIENTE, reintegra el stock
    if (nuevoEstado == EstadoVenta.CANCELADA) {
      for (DetalleVenta detalle : venta.getDetalleVenta()) {
        Producto producto = detalle.getProducto();
        producto.setStock(producto.getStock() + detalle.getCantidad());
        productoRepository.save(producto);
      }
    }

    venta.setEstado(nuevoEstado);
    Venta updatedVenta = ventaRepository.save(venta);

    return ventaMapper.toDTO(updatedVenta);
  }

  /*
   * ===================================
   * Cancelar una venta y devolver stock
   * ===================================
   */
  @Override
  @Transactional
  public StatusResponse cancelVenta(Long id) {
    updateEstadoVenta(id, EstadoVenta.CANCELADA);
    return StatusResponse.builder()
        .status(200)
        .message("Venta cancelada correctamente")
        .build();
  }
}