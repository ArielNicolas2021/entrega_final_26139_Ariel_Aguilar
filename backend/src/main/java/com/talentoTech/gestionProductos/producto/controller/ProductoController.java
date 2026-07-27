package com.talentoTech.gestionProductos.producto.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.talentoTech.gestionProductos.producto.dto.ProductoRequest;
import com.talentoTech.gestionProductos.producto.dto.ProductoResponse;
import com.talentoTech.gestionProductos.producto.model.ProductoModel;
import com.talentoTech.gestionProductos.producto.service.ProductoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
  @Autowired
  ProductoService productoService;

  // Método GET
  @GetMapping()
  public List<ProductoResponse> getProductos() {
    return productoService.getProductos();
  }

  // Método GET con id
  @GetMapping("/{id}")
  public ProductoResponse getProductoById(@PathVariable Long id) {
    return productoService.getProductoById(id);
  }

  // Método POST
  @PostMapping()
  public ProductoResponse crear(@RequestBody ProductoRequest request) {
    return productoService.createProducto(request);
  }

  // Método DELETE
  @DeleteMapping("/{id}")
  public String deleteProducto(@PathVariable Long id) {
    return productoService.deleteProducto(id);
  }

  // Método PATCH (UPDATE pero también permite enviar solo algunos campos)
  @PatchMapping("/{id}")
  public ResponseEntity<ProductoModel> updateProducto(@PathVariable Long id,
      @Valid @RequestBody ProductoRequest request) {
    Optional<ProductoModel> productoActualizado = productoService.updateProducto(id, request);

    if (productoActualizado.isPresent()) {
      return ResponseEntity.ok(productoActualizado.get());
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}
