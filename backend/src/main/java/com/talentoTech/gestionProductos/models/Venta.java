package com.talentoTech.gestionProductos.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ventas", indexes = @Index(name = "idx_venta_estado_fecha", columnList = "estado, fecha"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venta {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_venta")
  private Long id;

  @Column(nullable = false)
  private LocalDateTime fecha;

  @Column(name = "metodo_pago", nullable = false)
  private String metodoPago;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private EstadoVenta estado;

  @Column(nullable = false)
  private Double total = 0.0;

  @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<DetalleVenta> detalleVenta = new ArrayList<>();
}