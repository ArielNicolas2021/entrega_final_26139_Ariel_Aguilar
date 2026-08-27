package com.talentoTech.gestionProductos.producto.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.talentoTech.gestionProductos.producto.dto.ProductoDTO;
import com.talentoTech.gestionProductos.producto.dto.ProductoDeleteDTO;

public interface IProductoService {
  List<ProductoDTO> readProductos(Authentication auth);
  ProductoDTO readProductoById(Long id, Authentication auth);
  ProductoDTO createProducto(ProductoDTO productoDto, Authentication auth);
  ProductoDeleteDTO deleteProducto(Long id, Authentication auth);
  ProductoDTO updateProducto(Long id, ProductoDTO productoDto, Authentication auth);
}
