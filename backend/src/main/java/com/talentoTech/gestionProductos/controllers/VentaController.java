package com.talentoTech.gestionProductos.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.talentoTech.gestionProductos.dtos.VentaRequest;
import com.talentoTech.gestionProductos.dtos.VentaResponse;
import com.talentoTech.gestionProductos.models.EstadoVenta;
import com.talentoTech.gestionProductos.services.VentaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {
  private final VentaService ventaService;

  public VentaController(VentaService ventaService) {
    this.ventaService = ventaService;
  }

  // Método GET
  @GetMapping
  public ResponseEntity<Page<VentaResponse>> getVentas(
      @PageableDefault(size = 20, sort = "fecha", direction = Sort.Direction.DESC) Pageable pageable) {
    return ResponseEntity.ok(ventaService.getVentas(pageable));
  }

  // Método GET con id
  @GetMapping("/{id}")
  public ResponseEntity<VentaResponse> getVentaById(@PathVariable Long id) {
    return ResponseEntity.ok(ventaService.getVentaById(id));
  }

  // Método POST
  @PostMapping()
  public ResponseEntity<VentaResponse> createVenta(@Valid @RequestBody VentaRequest venta) {
    return ResponseEntity.ok(ventaService.createVenta(venta));
  }

  // Método PATCH (para cambiar el estado)
  @PatchMapping("/{id}/estado")
  public ResponseEntity<VentaResponse> updateEstadoVenta(
      @PathVariable Long id,
      @RequestParam EstadoVenta estado) {
    return ResponseEntity.ok(ventaService.updateEstadoVenta(id, estado));
  }
}
