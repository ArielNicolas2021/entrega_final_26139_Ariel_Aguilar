package com.talentoTech.gestionProductos.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.dtos.VentaRequest;
import com.talentoTech.gestionProductos.dtos.VentaResponse;
import com.talentoTech.gestionProductos.models.EstadoVenta;

public interface IVentaService {
  Page<VentaResponse> getVentas(Pageable pageable);

  VentaResponse getVentaById(Long id);

  VentaResponse createVenta(VentaRequest venta);

  StatusResponse cancelVenta(Long id);

  VentaResponse updateEstadoVenta(Long id, EstadoVenta nuevoEstado);
}
