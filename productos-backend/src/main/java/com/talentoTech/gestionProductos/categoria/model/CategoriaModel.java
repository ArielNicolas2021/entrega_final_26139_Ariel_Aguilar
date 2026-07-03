package com.talentoTech.gestionProductos.categoria.model;

import java.util.List;

import com.talentoTech.gestionProductos.producto.model.ProductoModel;

import jakarta.persistence.*;

@Entity
@Table(name = "categorias")
public class CategoriaModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(unique = true, nullable = false)
  private Long id;

  private String nombre;
  private String descripcion;

  @OneToMany(mappedBy = "categoria")
  private List<ProductoModel> productos;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getDescripcion() {
    return descripcion;
  }

  public void setDescripcion(String descripcion) {
    this.descripcion = descripcion;
  }

}
