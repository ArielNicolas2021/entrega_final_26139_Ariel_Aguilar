package com.talentoTech.gestionProductos.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_producto")
  private Long id;

  @Column(nullable = false)
  private String nombre;

  @Column(nullable = false, unique = true)
  private String codigo;

  private Double costo = 0.0;

  @Column(name = "precio_venta", nullable = false)
  private Double precioVenta;

  @Column(nullable = false)
  private Integer stock = 0;

  @Column(name = "imagen_url")
  private String imagenUrl;

  @Column(nullable = false)
  private Boolean activo = true;

  @Version
  private Long version;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_categoria", nullable = false)
  private Categoria categoria;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_marca")
  @OnDelete(action = OnDeleteAction.SET_NULL)
  private Marca marca;
}