package com.talentoTech.gestionProductos.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.talentoTech.gestionProductos.dtos.ProductoRequest;
import com.talentoTech.gestionProductos.dtos.ProductoResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.dtos.StockRequest;
import com.talentoTech.gestionProductos.services.IProductoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

  private final IProductoService productoService;

  // Método GET
  @GetMapping
  public ResponseEntity<Page<ProductoResponse>> getProducts(
      @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
    return ResponseEntity.ok(productoService.getProducts(pageable));
  }

  // Método GET con id
  @GetMapping("/{id}")
  public ResponseEntity<ProductoResponse> getProductoById(@PathVariable Long id) {
    return ResponseEntity.ok(productoService.getProductById(id));
  }

  // Método POST
  @PostMapping
  public ResponseEntity<ProductoResponse> postProducto(@Valid @RequestBody ProductoRequest prod) {
    return ResponseEntity.status(HttpStatus.CREATED).body(productoService.createProduct(prod));
  }

  // Método DELETE
  @DeleteMapping("/{id}")
  public ResponseEntity<StatusResponse> deleteProducto(@PathVariable Long id) {
    return ResponseEntity.ok(productoService.deleteProduct(id));
  }

  // Método PUT
  @PutMapping("/{id}")
  public ResponseEntity<ProductoResponse> updateProducto(
      @PathVariable Long id,
      @Valid @RequestBody ProductoRequest prod) {
    return ResponseEntity.ok(productoService.updateProduct(id, prod));
  }

  // Método PATCH para modificar stock
  @PatchMapping("/{id}/stock")
  public ResponseEntity<StatusResponse> updateStock(
      @PathVariable Long id,
      @Valid @RequestBody StockRequest request) {
    return ResponseEntity.ok(productoService.updateStock(id, request.stock()));
  }
}