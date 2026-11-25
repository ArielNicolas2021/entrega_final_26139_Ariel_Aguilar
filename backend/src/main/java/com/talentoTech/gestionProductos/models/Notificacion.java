// Notificacion.java
package com.talentoTech.gestionProductos.models;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notificaciones", indexes = @Index(name = "idx_notificacion_leida_fecha", columnList = "leida, fecha_creacion"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacion {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_notificacion")
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private TipoNotificacion tipo;

  @Column(nullable = false)
  private String titulo;

  @Column(nullable = false)
  private String mensaje;

  @Column(nullable = false)
  @Builder.Default
  private Boolean leida = false;

  @CreationTimestamp
  @Column(name = "fecha_creacion", nullable = false, updatable = false)
  private LocalDateTime fechaCreacion;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_producto", nullable = false)
  private Producto producto;
}