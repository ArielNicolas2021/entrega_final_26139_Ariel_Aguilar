package com.talentoTech.gestionProductos.venta.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.talentoTech.gestionProductos.venta.dto.VentaDTO;
import com.talentoTech.gestionProductos.venta.dto.VentaRequest;

public interface IVentaService {
  List<VentaDTO> readVentas(Authentication auth);
  VentaDTO createVenta(VentaRequest ventaRequest, Authentication auth);
  // String deleteVenta(Long id);
  // VentaDTO updateVenta(Long id, VentaDTO ventaDto);
}
