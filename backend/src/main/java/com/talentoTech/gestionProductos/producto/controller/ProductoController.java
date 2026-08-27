package com.talentoTech.gestionProductos.producto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.talentoTech.gestionProductos.producto.dto.ProductoDTO;
import com.talentoTech.gestionProductos.producto.dto.ProductoDeleteDTO;
import com.talentoTech.gestionProductos.producto.service.ProductoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
  @Autowired
  ProductoService productoService;

  // Método GET
  @GetMapping()
  public ResponseEntity<List<ProductoDTO>> getProductos(Authentication auth) {
    return ResponseEntity.ok(productoService.readProductos(auth));
  }

  // Método GET con id
  @GetMapping("/{id}")
  public ResponseEntity<ProductoDTO> getProductoById(@PathVariable Long id, Authentication auth) {
    return ResponseEntity.ok(productoService.readProductoById(id, auth));
  }

  // Método POST
  @PostMapping()
  public ResponseEntity<ProductoDTO> postProducto(@Valid @RequestBody ProductoDTO dto, Authentication auth) {
    return ResponseEntity.ok(productoService.createProducto(dto, auth));
  }

  // Método DELETE
  @DeleteMapping("/{id}")
  public ResponseEntity<ProductoDeleteDTO> deleteProducto(@PathVariable Long id, Authentication auth) {
    return ResponseEntity.ok(productoService.deleteProducto(id, auth));
  }

  // Métod PATCH
  @PatchMapping("/{id}")
  public ResponseEntity<ProductoDTO> patchProducto(@PathVariable Long id, @Valid @RequestBody ProductoDTO dto,
      Authentication auth) {
    ProductoDTO updatedProducto = productoService.updateProducto(id, dto, auth);
    return ResponseEntity.ok(updatedProducto);
  }
}
