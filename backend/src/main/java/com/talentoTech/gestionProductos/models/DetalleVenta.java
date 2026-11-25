package com.talentoTech.gestionProductos.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_ventas")
@Getter
@Setter
public class DetalleVenta {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_detalle")
  private Long id;

  @Column(nullable = false)
  private int cantidad;

  private double precioVenta;

  private double subtotal;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_producto")
  private Producto producto;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_venta")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Venta venta;
}
