package com.talentoTech.gestionProductos.producto.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.producto.dto.ProductoRequest;
import com.talentoTech.gestionProductos.categoria.model.CategoriaModel;
import com.talentoTech.gestionProductos.producto.model.ProductoModel;
import com.talentoTech.gestionProductos.categoria.repository.CategoriaRepository;
import com.talentoTech.gestionProductos.producto.repository.ProductoRepository;

@Service
public class ProductoService {
  @Autowired
  ProductoRepository productoRepository;

  @Autowired
  CategoriaRepository categoriaRepository;

  // Obtener todos los productos
  public ArrayList<ProductoModel> getProductos() {
    return (ArrayList<ProductoModel>) productoRepository.findAll();
  }

  // Obtener un producto por su id
  public ProductoModel getProductoById(Long id) {
    return productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado."));
  }

  // Crear producto
  public ProductoModel createProducto(ProductoRequest request) {
    CategoriaModel categoria = categoriaRepository
        .findById(request.getCategoriaId())
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    ProductoModel producto = new ProductoModel();
    producto.setNombre(request.getNombre());
    producto.setCategoria(categoria);
    producto.setPrecio(request.getPrecio());
    producto.setStock(request.getStock());

    return productoRepository.save(producto);
  }

  // Eliminar producto
  public String deleteProducto(Long id) {
    productoRepository.deleteById(id);
    return "Producto eliminado!";
  }

  // Modificar producto
  public Optional<ProductoModel> updateProducto(Long id, ProductoRequest request) {
    Optional<ProductoModel> productoData = productoRepository.findById(id);

    if (productoData.isPresent()) {
      ProductoModel productoModel = productoData.get();

      if (request.getNombre() != null) {
        productoModel.setNombre(request.getNombre());
      }
      if (request.getPrecio() != 0.0) {
        productoModel.setPrecio(request.getPrecio());
      }
      if (request.getStock() != 0) {
        productoModel.setStock(request.getStock());
      }
      if (request.getCategoriaId() != null) {
        CategoriaModel categoria = categoriaRepository
            .findById(request.getCategoriaId())
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        productoModel.setCategoria(categoria);
      }

      return Optional.of(productoRepository.save(productoModel));
    } else {
      return Optional.empty();
    }
  }
}
