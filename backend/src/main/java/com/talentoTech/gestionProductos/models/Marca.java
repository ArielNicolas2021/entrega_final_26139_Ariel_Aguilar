package com.talentoTech.gestionProductos.models;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "marcas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Marca {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_marca")
  private Long id;

  @Column(nullable = false, unique = true)
  private String nombre;

  @OneToMany(mappedBy = "marca")
  private List<Producto> productos = new ArrayList<>();

  @ManyToMany(mappedBy = "marcas")
  private Set<Categoria> categorias = new HashSet<>();

  // Sincroniza ambos lados de la relación para que JPA persista en
  // 'categoria_marca'
  public void addCategoria(Categoria categoria) {
    this.categorias.add(categoria);
    categoria.getMarcas().add(this);
  }

  public void removeCategoria(Categoria categoria) {
    this.categorias.remove(categoria);
    categoria.getMarcas().remove(this);
  }
}