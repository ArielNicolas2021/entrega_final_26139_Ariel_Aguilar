package com.talentoTech.gestionProductos.producto.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductoRequest {

  @NotBlank(message = "El nombre del producto es obligatorio.")
  private String nombre;

  @NotNull(message = "El precio del producto es obligatorio.")
  @DecimalMin(value = "0.0", inclusive = false, message = "El precio del producto debe ser mayor que 0.")
  private double precio;

  @NotNull(message = "El stock del producto es obligatorio.")
  @Min(value = 0, message = "El stock del producto no puede ser negativo.")
  private int stock;

  @NotNull(message = "El id de la categoría es obligatorio.")
  @Min(value = 0, message = "El id de la categoría no puede ser negativo.")
  private Long categoriaId;

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

  public void setCategoriaId(Long categoriaId) {
    this.categoriaId = categoriaId;
  }

  public Long getCategoriaId() {
    return categoriaId;
  }
}
