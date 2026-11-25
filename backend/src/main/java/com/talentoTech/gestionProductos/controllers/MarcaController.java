package com.talentoTech.gestionProductos.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.talentoTech.gestionProductos.dtos.MarcaRequest;
import com.talentoTech.gestionProductos.dtos.MarcaResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.services.IMarcaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/marcas")
@RequiredArgsConstructor
public class MarcaController {

  private final IMarcaService marcaService;

  // Método GET
  @GetMapping
  public ResponseEntity<Page<MarcaResponse>> getMarcas(
      @PageableDefault(size = 20, sort = "nombre", direction = Sort.Direction.ASC) Pageable pageable) {
    return ResponseEntity.ok(marcaService.getMarcas(pageable));
  }

  // Método GET con id
  @GetMapping("/{id}")
  public ResponseEntity<MarcaResponse> getMarcaById(@PathVariable Long id) {
    return ResponseEntity.ok(marcaService.getMarcaById(id));
  }

  // Método POST
  @PostMapping
  public ResponseEntity<MarcaResponse> createMarca(@Valid @RequestBody MarcaRequest marca) {
    return ResponseEntity.status(HttpStatus.CREATED).body(marcaService.createMarca(marca));
  }

  // Método DELETE
  @DeleteMapping("/{id}")
  public ResponseEntity<StatusResponse> deleteMarca(@PathVariable Long id) {
    return ResponseEntity.ok(marcaService.deleteMarca(id));
  }

  // Método PUT
  @PutMapping("/{id}")
  public ResponseEntity<MarcaResponse> updateMarca(@PathVariable Long id, @Valid @RequestBody MarcaRequest marca) {
    return ResponseEntity.ok(marcaService.updateMarca(id, marca));
  }
}