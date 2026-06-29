package com.talentoTech.producto.controllers;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talentoTech.producto.dto.CategoriaRequest;
import com.talentoTech.producto.models.CategoriaModel;
import com.talentoTech.producto.services.CategoriaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

  @Autowired
  CategoriaService categoriaService;

  // Método GET
  @GetMapping()
  public ArrayList<CategoriaModel> getCategorias() {
    return categoriaService.getCategorias();
  }

  // Método GET con id
  @GetMapping("/{id}")
  public CategoriaModel getCategoriaPorId(@PathVariable Long id) {
    return categoriaService.getCategoriaById(id);
  }

  // Método POST
  @PostMapping()
  public CategoriaModel createCategoria(@Valid @RequestBody CategoriaRequest request) {
    CategoriaModel categoria = categoriaService.createCategoria(request);
    return categoria;
  }

  // Método DELETE
  @DeleteMapping("/{id}")
  public String deleteCategoria(@PathVariable Long id) {
    return categoriaService.deleteCategoria(id);
  }

  // Método PATCH
  @PatchMapping("/{id}")
  public ResponseEntity<CategoriaModel> updateCategoria(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
    Optional<CategoriaModel> categoria = categoriaService.updateCategoria(id, request);

    if (categoria.isPresent()) {
      return ResponseEntity.ok(categoria.get());
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}
