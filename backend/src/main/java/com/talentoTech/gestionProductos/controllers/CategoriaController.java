package com.talentoTech.gestionProductos.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.talentoTech.gestionProductos.dtos.CategoriaRequest;
import com.talentoTech.gestionProductos.dtos.CategoriaResponse;
import com.talentoTech.gestionProductos.dtos.MarcaResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.services.ICategoriaService;
import com.talentoTech.gestionProductos.services.IMarcaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

  private final ICategoriaService categoriaService;
  private final IMarcaService marcaService;

  @GetMapping
  public ResponseEntity<Page<CategoriaResponse>> getCategorias(
      @PageableDefault(size = 20, sort = "nombre", direction = Sort.Direction.ASC) Pageable pageable) {
    return ResponseEntity.ok(categoriaService.getCategories(pageable));
  }

  @GetMapping("/{id}")
  public ResponseEntity<CategoriaResponse> getCategoriaById(@PathVariable Long id) {
    return ResponseEntity.ok(categoriaService.getCategoryById(id));
  }

  @GetMapping("/{id}/marcas")
  public ResponseEntity<List<MarcaResponse>> getMarcasByCategoria(@PathVariable Long id) {
    return ResponseEntity.ok(marcaService.getMarcasByCategoriaId(id));
  }

  @PostMapping
  public ResponseEntity<CategoriaResponse> createCategoria(@Valid @RequestBody CategoriaRequest cat) {
    return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.createCategory(cat));
  }

  @PutMapping("/{id}")
  public ResponseEntity<CategoriaResponse> updateCategoria(
      @PathVariable Long id,
      @Valid @RequestBody CategoriaRequest cat) {
    return ResponseEntity.ok(categoriaService.updateCategory(id, cat));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<StatusResponse> deleteCategoria(@PathVariable Long id) {
    return ResponseEntity.ok(categoriaService.deleteCategory(id));
  }
}