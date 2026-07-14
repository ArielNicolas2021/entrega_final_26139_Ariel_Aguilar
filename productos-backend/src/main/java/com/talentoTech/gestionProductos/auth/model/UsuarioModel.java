package com.talentoTech.gestionProductos.auth.model;

import java.util.List;

import com.talentoTech.gestionProductos.categoria.model.CategoriaModel;
import com.talentoTech.gestionProductos.producto.model.ProductoModel;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(unique = true, nullable = false)
  private Long id;

  private String nombre;
  private String email;
  private String password;

  @OneToMany(mappedBy = "usuario")
  private List<CategoriaModel> categorias;

  @OneToMany(mappedBy = "usuario")
  private List<ProductoModel> productos;
}