package com.talentoTech.gestionProductos.venta.model;

import java.util.ArrayList;
import java.util.List;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.detalle_venta.model.DetalleVenta;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ventas")
@Getter
@Setter
public class Venta {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(unique = true, nullable = false)
  private Long id;

  private String fecha;
  private double total;

  @ManyToOne
  @JoinColumn(name = "usuario_id")
  private Usuario usuario;

  @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
  private List<DetalleVenta> detalleVenta = new ArrayList<>();
}