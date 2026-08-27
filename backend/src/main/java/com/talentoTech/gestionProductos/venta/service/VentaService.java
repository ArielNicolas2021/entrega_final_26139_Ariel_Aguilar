package com.talentoTech.gestionProductos.venta.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;
import com.talentoTech.gestionProductos.categoria.model.Categoria;
import com.talentoTech.gestionProductos.categoria.repository.CategoriaRepository;
import com.talentoTech.gestionProductos.detalle_venta.dto.DetalleVentaRequest;
import com.talentoTech.gestionProductos.detalle_venta.model.DetalleVenta;
import com.talentoTech.gestionProductos.detalle_venta.repository.DetalleVentaRepository;
import com.talentoTech.gestionProductos.mapper.Mapper;
import com.talentoTech.gestionProductos.producto.model.Producto;
import com.talentoTech.gestionProductos.producto.repository.ProductoRepository;
import com.talentoTech.gestionProductos.venta.dto.VentaDTO;
import com.talentoTech.gestionProductos.venta.dto.VentaRequest;
import com.talentoTech.gestionProductos.venta.model.Venta;
import com.talentoTech.gestionProductos.venta.repository.VentaRepository;

import jakarta.transaction.Transactional;

@Service
public class VentaService implements IVentaService {
  @Autowired
  private VentaRepository ventaRepository;

  @Autowired
  private UsuarioRepository usuarioRepository;

  @Autowired
  private DetalleVentaRepository detalleVentaRepository;

  @Autowired
  private ProductoRepository productoRepository;

  @Autowired CategoriaRepository categoriaRepository;

  // Obtener las ventas de un usuario
  public List<VentaDTO> readVentas(Authentication auth) {
    // Obtenemos el usuario autenticado
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());

    // Traemos las ventas del usuario autenticado
    List<Venta> ventas = ventaRepository.findByUsuario(usuario);

    // Creamos lista vacía para guardas las ventas
    List<VentaDTO> ventasDto = new ArrayList<>();

    // Recorremos y guardamos las ventas
    VentaDTO dto;
    for (Venta v : ventas) {
      dto = Mapper.toDTO(v);
      ventasDto.add(dto);
    }

    return ventasDto;
  }

  // Crear una venta
  @Transactional
  public VentaDTO createVenta(VentaRequest ventaRequest, Authentication auth) {
    // Obtenemos el usuario autenticado
    Usuario usuario = usuarioRepository.findByEmail(auth.getName());

    // Creamos la venta
    Venta newVenta = new Venta();
    newVenta.setFecha(ventaRequest.getFecha());
    newVenta.setUsuario(usuario);

    // Hacemos un guardado parcial
    Venta saveVenta = ventaRepository.save(newVenta);

    double total = 0.0;
    for (DetalleVentaRequest detalleVenta : ventaRequest.getDetalleVenta()) {
      // Obtenemos el producto por cada detalle
      Producto producto = productoRepository.findByIdAndUsuario(detalleVenta.getProductoID(), usuario)
          .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
      // Calculamos el subtotal
      double subtotal = detalleVenta.getCantidad() * producto.getPrecio();

      // Creamos el detalle de UN PRODUCTO vendido
      DetalleVenta newDetalleVenta = new DetalleVenta();
      newDetalleVenta.setCantidad(detalleVenta.getCantidad());
      newDetalleVenta.setPrecio_unitario(producto.getPrecio());
      newDetalleVenta.setSubtotal(subtotal);
      newDetalleVenta.setVenta(newVenta);
      newDetalleVenta.setProducto(producto);
      newDetalleVenta.setUsuario(usuario);

      // Guardamos el detalle
      saveVenta.getDetalleVenta().add(newDetalleVenta);
      total += subtotal;
      detalleVentaRepository.save(newDetalleVenta);

      // Modificamos el stock del producto
      Categoria categoria = categoriaRepository.findByIdAndUsuario(producto.getCategoria().getId(), usuario).orElse(null);

      producto.setNombre(producto.getNombre());
      producto.setPrecio(producto.getPrecio());
      producto.setStock(producto.getStock() - newDetalleVenta.getCantidad());
      producto.setCategoria(categoria);
      producto.setUsuario(usuario);

      productoRepository.save(producto);
    }
    // Guardamos la venta
    saveVenta.setTotal(total);
    saveVenta = ventaRepository.save(saveVenta);

    return Mapper.toDTO(saveVenta);
  }
}
