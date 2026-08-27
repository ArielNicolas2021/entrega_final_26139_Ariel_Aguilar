package com.talentoTech.gestionProductos.mapper;

import java.util.stream.Collectors;

import com.talentoTech.gestionProductos.auth.dto.UsuarioDTO;
import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.categoria.dto.CategoriaDTO;
import com.talentoTech.gestionProductos.categoria.model.Categoria;
import com.talentoTech.gestionProductos.detalle_venta.dto.DetalleVentaDTO;
import com.talentoTech.gestionProductos.detalle_venta.model.DetalleVenta;
import com.talentoTech.gestionProductos.producto.dto.ProductoDTO;
import com.talentoTech.gestionProductos.producto.model.Producto;
import com.talentoTech.gestionProductos.venta.dto.VentaDTO;
import com.talentoTech.gestionProductos.venta.model.Venta;

public class Mapper {
  // Mapear de Producto a ProductoDTO
  public static ProductoDTO toDTO(Producto producto) {
    if (producto == null)
      return null;

    return ProductoDTO.builder()
        .id(producto.getId())
        .nombre(producto.getNombre())
        .precio(producto.getPrecio())
        .stock(producto.getStock())
        .categoria(producto.getCategoria().getNombre())
        .categoriaID(producto.getCategoria().getId())
        .usuarioID(producto.getUsuario().getId())
        .build();
  }

  // Mapear de Categoria a CategoriaDTO
  public static CategoriaDTO toDTO(Categoria categoria) {
    if (categoria == null)
      return null;

    return CategoriaDTO.builder()
        .id(categoria.getId())
        .nombre(categoria.getNombre())
        .descripcion(categoria.getDescripcion())
        .usuarioID(categoria.getUsuario().getId())
        .build();
  }

  // Mapear de Venta a VentaDTO
  public static VentaDTO toDTO(Venta venta) {
    if (venta == null)
      return null;

    var detalleVentaDTOs = venta.getDetalleVenta().stream()
        .map(Mapper::toDTO)
        .collect(Collectors.toList());

    return VentaDTO.builder()
        .id(venta.getId())
        .fecha(venta.getFecha())
        .total(venta.getTotal())
        .usuarioId(venta.getUsuario().getId())
        .detalleVenta(detalleVentaDTOs)
        .build();
  }

  // Mapear de DetalleVenta a DetalleVentaDTO
  public static DetalleVentaDTO toDTO(DetalleVenta detalleVenta) {
    if (detalleVenta == null)
      return null;

    return DetalleVentaDTO.builder()
        .id(detalleVenta.getId())
        .cantidad(detalleVenta.getCantidad())
        .precio_unitario(detalleVenta.getPrecio_unitario())
        .subtotal(detalleVenta.getCantidad() * detalleVenta.getPrecio_unitario())
        .ventaID(detalleVenta.getVenta().getId())
        .productoID(detalleVenta.getProducto().getId())
        .usuarioID(detalleVenta.getUsuario().getId())
        .build();
  }

  // Mapear de Usuario a UsuarioDTO
  public static UsuarioDTO toDTO(Usuario usuario) {
    if (usuario == null)
      return null;

    return UsuarioDTO.builder()
        .id(usuario.getId())
        .nombre(usuario.getNombre())
        .email(usuario.getEmail())
        .password(usuario.getPassword())
        .build();
  }
}
