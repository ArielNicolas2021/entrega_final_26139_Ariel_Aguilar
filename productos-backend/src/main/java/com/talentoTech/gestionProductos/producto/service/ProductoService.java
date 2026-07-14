package com.talentoTech.gestionProductos.producto.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.producto.dto.ProductoRequest;
import com.talentoTech.gestionProductos.producto.dto.ProductoResponse;
import com.talentoTech.gestionProductos.auth.model.UsuarioModel;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;
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

  @Autowired
  UsuarioRepository usuarioRepository;

  // Obtener todos los productos
  public List<ProductoResponse> getProductos() {
    List<ProductoModel> productos = (List<ProductoModel>) productoRepository.findAll();
    return productos.stream().map(producto -> ProductoResponse.builder()
        .id(producto.getId())
        .nombre(producto.getNombre())
        .precio(producto.getPrecio())
        .stock(producto.getStock())
        .usuarioId(producto.getUsuario().getId())
        .categoria(producto.getCategoria().getNombre())
        .build()).collect(java.util.stream.Collectors.toList());
  }

  // Obtener un producto por su id
  public ProductoResponse getProductoById(Long id) {
    ProductoModel producto = productoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    return ProductoResponse.builder()
        .id(producto.getId())
        .nombre(producto.getNombre())
        .precio(producto.getPrecio())
        .stock(producto.getStock())
        .usuarioId(producto.getUsuario().getId())
        .categoria(producto.getCategoria().getNombre())
        .build();
  }

  // Crear producto
  public ProductoResponse createProducto(ProductoRequest request) {
    CategoriaModel categoria = categoriaRepository
        .findById(request.getCategoria())
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    UsuarioModel usuario = usuarioRepository
        .findById(request.getUsuario())
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    ProductoModel producto = new ProductoModel();
    producto.setNombre(request.getNombre());
    producto.setPrecio(request.getPrecio());
    producto.setStock(request.getStock());
    producto.setCategoria(categoria);
    producto.setUsuario(usuario);

    ProductoModel productoGuardado = productoRepository.save(producto);

    return ProductoResponse.builder()
        .id(productoGuardado.getId())
        .nombre(productoGuardado.getNombre())
        .precio(productoGuardado.getPrecio())
        .stock(productoGuardado.getStock())
        .usuarioId(productoGuardado.getUsuario().getId())
        .categoria(productoGuardado.getCategoria().getNombre())
        .build();
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
      if (request.getCategoria() != null) {
        CategoriaModel categoria = categoriaRepository
            .findById(request.getCategoria())
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        productoModel.setCategoria(categoria);
      }

      if (request.getUsuario() != null) {
        UsuarioModel usuario = usuarioRepository
            .findById(request.getUsuario())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        productoModel.setUsuario(usuario);
      }

      return Optional.of(productoRepository.save(productoModel));
    } else {
      return Optional.empty();
    }
  }
}
