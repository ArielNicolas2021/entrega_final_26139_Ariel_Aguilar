package com.talentoTech.gestionProductos.categoria.model;

import java.util.List;

import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.producto.model.Producto;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(unique = true, nullable = false)
  private Long id;

  private String nombre;
  private String descripcion;

  @ManyToOne
  @JoinColumn(name = "usuario_id")
  private Usuario usuario;

  @OneToMany(mappedBy = "categoria")
  private List<Producto> productos;
}
