package com.talentoTech.gestionProductos.venta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talentoTech.gestionProductos.venta.dto.VentaDTO;
import com.talentoTech.gestionProductos.venta.dto.VentaRequest;
import com.talentoTech.gestionProductos.venta.service.VentaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {
  @Autowired
  VentaService ventaService;

  // Método GET
  @GetMapping()
  public ResponseEntity<List<VentaDTO>> getVentas(Authentication auth) {
    return ResponseEntity.ok(ventaService.readVentas(auth));
  }

  // Método POST
  @PostMapping()
  public ResponseEntity<VentaDTO> postVenta(@Valid @RequestBody VentaRequest ventaRequest, Authentication auth) {
    return ResponseEntity.ok(ventaService.createVenta(ventaRequest, auth));
  }
}
