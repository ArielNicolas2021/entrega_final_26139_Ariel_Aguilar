package com.talentoTech.gestionProductos.detalle_venta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;
import com.talentoTech.gestionProductos.detalle_venta.dto.DetalleVentaDTO;
import com.talentoTech.gestionProductos.detalle_venta.model.DetalleVenta;
import com.talentoTech.gestionProductos.detalle_venta.repository.DetalleVentaRepository;
import com.talentoTech.gestionProductos.mapper.Mapper;
import com.talentoTech.gestionProductos.producto.model.Producto;
import com.talentoTech.gestionProductos.producto.repository.ProductoRepository;
import com.talentoTech.gestionProductos.venta.model.Venta;
import com.talentoTech.gestionProductos.venta.repository.VentaRepository;

@Service
public class DetalleVentaService {
  @Autowired
  private DetalleVentaRepository detalleVentaRepository;

  @Autowired
  private UsuarioRepository usuarioRepository;

  @Autowired
  private VentaRepository ventaRepository;

  @Autowired
  private ProductoRepository productoRepository;

  // Creamos el detalle de la venta
  public DetalleVentaDTO createDetalleVenta(DetalleVentaDTO detalleVentaDto, Authentication auth) {
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());
    Venta venta = ventaRepository.findById(detalleVentaDto.getVentaID()).orElseThrow(() -> new RuntimeException("Venta no encontrada"));
    Producto producto = productoRepository.findById(detalleVentaDto.getProductoID()).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    DetalleVenta newDetalleVenta = new DetalleVenta();
    newDetalleVenta.setCantidad(detalleVentaDto.getCantidad());
    newDetalleVenta.setPrecio_unitario(detalleVentaDto.getPrecio_unitario());
    newDetalleVenta.setSubtotal(detalleVentaDto.getCantidad() * newDetalleVenta.getPrecio_unitario());
    newDetalleVenta.setVenta(venta);
    newDetalleVenta.setProducto(producto);
    newDetalleVenta.setUsuario(usuario);

    DetalleVenta saveDetalleVenta = detalleVentaRepository.save(newDetalleVenta);

    return Mapper.toDTO(saveDetalleVenta);
  }
}
