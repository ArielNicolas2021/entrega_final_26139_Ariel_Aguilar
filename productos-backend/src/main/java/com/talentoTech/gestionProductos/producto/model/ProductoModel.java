package com.talentoTech.gestionProductos.producto.model;

import com.talentoTech.gestionProductos.categoria.model.CategoriaModel;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class ProductoModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(unique = true, nullable = false)
  private Long id;

  private String nombre;
  private double precio;
  private int stock;

  @ManyToOne
  @JoinColumn(name = "categoria_id")
  private CategoriaModel categoria;

  public void setId(Long id) {
    this.id = id;
  }

  public Long getId() {
    return id;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getNombre() {
    return nombre;
  }

  public void setPrecio(double precio) {
    this.precio = precio;
  }

  public double getPrecio() {
    return precio;
  }

  public void setStock(int stock) {
    this.stock = stock;
  }

  public int getStock() {
    return stock;
  }

  public CategoriaModel getCategoria() {
    return categoria;
  }

  public void setCategoria(CategoriaModel categoria) {
    this.categoria = categoria;
  }
}
