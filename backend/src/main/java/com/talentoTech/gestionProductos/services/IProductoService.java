package com.talentoTech.gestionProductos.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.talentoTech.gestionProductos.dtos.ProductoRequest;
import com.talentoTech.gestionProductos.dtos.ProductoResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;

public interface IProductoService {
  Page<ProductoResponse> getProducts(Pageable pageable);

  ProductoResponse getProductById(Long id);

  ProductoResponse createProduct(ProductoRequest product);

  StatusResponse deleteProduct(Long id);

  ProductoResponse updateProduct(Long id, ProductoRequest product);

  StatusResponse updateStock(Long id, int stock);
}
