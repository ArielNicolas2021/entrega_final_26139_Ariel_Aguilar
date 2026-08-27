package com.talentoTech.gestionProductos.producto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.producto.dto.ProductoDTO;
import com.talentoTech.gestionProductos.producto.dto.ProductoDeleteDTO;
import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;
import com.talentoTech.gestionProductos.categoria.model.Categoria;
import com.talentoTech.gestionProductos.producto.model.Producto;
import com.talentoTech.gestionProductos.categoria.repository.CategoriaRepository;
import com.talentoTech.gestionProductos.mapper.Mapper;
import com.talentoTech.gestionProductos.producto.repository.ProductoRepository;

@Service
public class ProductoService implements IProductoService {
  @Autowired
  private ProductoRepository productoRepository;

  @Autowired
  private CategoriaRepository categoriaRepository;

  @Autowired
  private UsuarioRepository usuarioRepository;

  // Obtener todos los productos
  public List<ProductoDTO> readProductos(Authentication auth) {
    // Obtener el usuario autenticado
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());

    return productoRepository.findByUsuario(usuario).stream().map(Mapper::toDTO).toList();
  }

  // Obtener un producto por su id
  public ProductoDTO readProductoById(Long id, Authentication auth) {
    // Obtener el usuario autenticado
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());

    Producto producto = productoRepository.findByIdAndUsuario(id, usuario).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    return Mapper.toDTO(producto);
  }

  // Crear producto
  public ProductoDTO createProducto(ProductoDTO prod, Authentication auth) {
    // Obtener la categoría por su id
    Categoria categoria = categoriaRepository.findById(prod.getCategoriaID()).orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    // Obtener el usuario autenticado
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());

    // Crear un nuevo producto
    Producto producto = new Producto();

    producto.setNombre(prod.getNombre());
    producto.setPrecio(prod.getPrecio());
    producto.setStock(prod.getStock());
    producto.setCategoria(categoria);
    producto.setUsuario(usuario);

    Producto saveProducto = productoRepository.save(producto);

    return Mapper.toDTO(saveProducto);
  }

  // Eliminar producto
  public ProductoDeleteDTO deleteProducto(Long id, Authentication auth) {
    // Obtener el usuario autenticado
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());
    if (usuario == null) {
      throw new RuntimeException("Usuario no encontrado");
    }

    // Verificar si el producto pertenece al usuario
    Producto producto = productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    if (!producto.getUsuario().getId().equals(usuario.getId())) {
      throw new RuntimeException("No tienes permiso para eliminar este producto");
    }

    productoRepository.deleteById(id);
    return ProductoDeleteDTO.builder()
      .status(200)
      .message("Producto eliminado correctamente")
      .build();
  }

  // Modificar producto
  public ProductoDTO updateProducto(Long id, ProductoDTO productoDto, Authentication auth) {
    // Obtener el producto
    Producto producto = productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    // Obtener la categoria
    Categoria categoria = categoriaRepository.findById(productoDto.getCategoriaID()).orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

    // Obtener el usuario
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());
    if (usuario == null) {
      throw new RuntimeException("Usuario no encontrado");
    }

    // Actualizar los campos del producto
    producto.setNombre(productoDto.getNombre());
    producto.setPrecio(productoDto.getPrecio());
    producto.setStock(productoDto.getStock());
    producto.setCategoria(categoria);
    producto.setUsuario(usuario);

    Producto saveProducto = productoRepository.save(producto);

    return Mapper.toDTO(saveProducto);
  }
}
