package com.talentoTech.gestionProductos.auth.model;

import java.util.ArrayList;
import java.util.List;

import com.talentoTech.gestionProductos.categoria.model.Categoria;
import com.talentoTech.gestionProductos.producto.model.Producto;
// import com.talentoTech.gestionProductos.venta.model.Venta;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(unique = true, nullable = false)
  private Long id;

  private String nombre;
  private String email;
  private String password;

  @OneToMany(mappedBy = "usuario")
  private List<Categoria> categorias = new ArrayList<>();

  @OneToMany(mappedBy = "usuario")
  private List<Producto> productos = new ArrayList<>();

  // @OneToMany(mappedBy = "usuario")
  // private List<Venta> ventas = new ArrayList<>();
}