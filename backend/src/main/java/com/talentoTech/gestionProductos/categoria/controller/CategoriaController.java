package com.talentoTech.gestionProductos.categoria.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talentoTech.gestionProductos.categoria.dto.CategoriaDTO;
import com.talentoTech.gestionProductos.categoria.dto.CategoriaDeleteDTO;
import com.talentoTech.gestionProductos.categoria.service.CategoriaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

  @Autowired
  CategoriaService categoriaService;

  // Método GET
  @GetMapping()
  public ResponseEntity<List<CategoriaDTO>> getCategorias(Authentication auth) {
    return ResponseEntity.ok(categoriaService.readCategorias(auth));
  }

  // Método GET con id
  @GetMapping("/{id}")
  public ResponseEntity<CategoriaDTO> getCategoriaPorId(@PathVariable Long id, Authentication auth) {
    return ResponseEntity.ok(categoriaService.readCategoriaById(id, auth));
  }

  // Método POST
  @PostMapping()
  public ResponseEntity<CategoriaDTO> createCategoria(@Valid @RequestBody CategoriaDTO categoria, Authentication auth) {
    CategoriaDTO newCategoria = categoriaService.createCategoria(categoria, auth);
    return ResponseEntity.created(URI.create("api/categorias" + categoria.getId())).body(newCategoria);
  }

  // Método DELETE
  @DeleteMapping("/{id}")
  public ResponseEntity<CategoriaDeleteDTO> deleteCategoria(@PathVariable Long id, Authentication auth) {
    return ResponseEntity.ok(categoriaService.deleteCategoria(id, auth));
  }

  // Método PATCH
  @PatchMapping("/{id}")
  public ResponseEntity<CategoriaDTO> updateCategoria(@PathVariable Long id,
      @Valid @RequestBody CategoriaDTO categoria, Authentication auth) {
    return ResponseEntity.ok(categoriaService.updateCategoria(id, categoria, auth));
  }
}
