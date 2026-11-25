package com.talentoTech.gestionProductos.services;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.talentoTech.gestionProductos.dtos.ProductoRequest;
import com.talentoTech.gestionProductos.dtos.ProductoResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.events.StockActualizadoEvent;
import com.talentoTech.gestionProductos.mapper.ProductoMapper;
import com.talentoTech.gestionProductos.models.Categoria;
import com.talentoTech.gestionProductos.models.Marca;
import com.talentoTech.gestionProductos.models.Producto;
import com.talentoTech.gestionProductos.repositories.CategoriaRepository;
import com.talentoTech.gestionProductos.repositories.MarcaRepository;
import com.talentoTech.gestionProductos.repositories.ProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoService implements IProductoService {

  private final ProductoRepository productoRepository;
  private final ProductoMapper productoMapper;
  private final CategoriaRepository categoriaRepository;
  private final MarcaRepository marcaRepository;
  private final ApplicationEventPublisher eventPublisher;

  /*
   * ===========================
   * Obtener todos los productos
   * ===========================
   */
  @Override
  @Transactional(readOnly = true)
  public Page<ProductoResponse> getProducts(Pageable pageable) {
    return productoRepository.findAll(pageable).map(productoMapper::toDTO);
  }

  /*
   * =============================
   * Obtener un producto por su id
   * =============================
   */
  @Override
  @Transactional(readOnly = true)
  public ProductoResponse getProductById(Long id) {
    Producto producto = productoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    return productoMapper.toDTO(producto);
  }

  /*
   * =================
   * Crear un producto
   * =================
   */
  @Override
  @Transactional
  public ProductoResponse createProduct(ProductoRequest prod) {
    if (productoRepository.existsByCodigo(prod.codigo())) {
      throw new RuntimeException("Ya existe un producto con el código: " + prod.codigo());
    }

    Producto producto = productoMapper.toEntity(prod);
    assignRelations(prod, producto);

    Producto savedProducto = productoRepository.save(producto);

    // Notifica si el producto se dio de alta directamente con stock <= 5 o en 0
    eventPublisher.publishEvent(
        new StockActualizadoEvent(savedProducto, Integer.MAX_VALUE, savedProducto.getStock()));

    return productoMapper.toDTO(savedProducto);
  }

  /*
   * ====================
   * Eliminar un producto
   * ====================
   */
  @Override
  @Transactional
  public StatusResponse deleteProduct(Long id) {
    Producto producto = productoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    productoRepository.delete(producto);
    return StatusResponse.builder()
        .status(200)
        .message("Producto eliminado correctamente")
        .build();
  }

  /*
   * =====================
   * Modificar un producto
   * =====================
   */
  @Override
  @Transactional
  public ProductoResponse updateProduct(Long id, ProductoRequest prod) {
    Producto producto = productoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    if (!producto.getCodigo().equals(prod.codigo()) && productoRepository.existsByCodigo(prod.codigo())) {
      throw new RuntimeException("Ya existe otro producto con el código: " + prod.codigo());
    }

    int stockAnterior = producto.getStock();

    productoMapper.updateEntityFromRequest(prod, producto);
    assignRelations(prod, producto);

    Producto savedProducto = productoRepository.save(producto);

    eventPublisher.publishEvent(
        new StockActualizadoEvent(savedProducto, stockAnterior, savedProducto.getStock()));

    return productoMapper.toDTO(savedProducto);
  }

  /*
   * ==============================
   * Modificar stock de un producto
   * ==============================
   */
  @Override
  @Transactional
  public StatusResponse updateStock(Long id, int stock) {
    if (stock < 0) {
      throw new RuntimeException("El stock no puede ser negativo");
    }

    Producto producto = productoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    int stockAnterior = producto.getStock();
    producto.setStock(stock);
    productoRepository.save(producto);

    eventPublisher.publishEvent(new StockActualizadoEvent(producto, stockAnterior, stock));

    return StatusResponse.builder()
        .status(200)
        .message("Stock modificado correctamente")
        .build();
  }

  private void assignRelations(ProductoRequest prod, Producto producto) {
    Categoria categoria = categoriaRepository.findById(prod.categoriaID())
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    Marca marca = (prod.marcaID() != null)
        ? marcaRepository.findById(prod.marcaID())
            .orElseThrow(() -> new RuntimeException("Marca no encontrada"))
        : null;

    producto.setCategoria(categoria);
    producto.setMarca(marca);
  }
}