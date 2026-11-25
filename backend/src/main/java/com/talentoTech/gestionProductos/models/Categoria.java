package com.talentoTech.gestionProductos.models;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
  @Column(name = "id_categoria")
  private Long id;

  @Column(unique = true, nullable = false)
  private String nombre;

  private String descripcion;

  @OneToMany(mappedBy = "categoria")
  private List<Producto> productos = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "categoria_marca", joinColumns = @JoinColumn(name = "id_categoria"), inverseJoinColumns = @JoinColumn(name = "id_marca"))
  private Set<Marca> marcas = new HashSet<>();

}