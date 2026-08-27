package com.talentoTech.gestionProductos.detalle_venta.model;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.producto.model.Producto;
import com.talentoTech.gestionProductos.venta.model.Venta;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_ventas")
@Getter
@Setter
public class DetalleVenta {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(unique = true, nullable = false)
  private Long id;

  private int cantidad;
  private double precio_unitario;
  private double subtotal;

  @ManyToOne
  @JoinColumn(name = "venta_id")
  private Venta venta;

  @ManyToOne
  @JoinColumn(name = "producto_id")
  private Producto producto;

  @ManyToOne
  @JoinColumn(name = "usuario_id")
  private Usuario usuario;
}
