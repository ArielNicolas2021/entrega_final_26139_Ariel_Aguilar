package com.talentoTech.producto.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoriaRequest {

  @NotBlank(message = "El nombre de la categoría es obligatoria.")
  private String nombre;

  @NotBlank(message = "La descripción de la categoría es obligatoria.")
  private String descripcion;

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getNombre() {
    return nombre;
  }

  public void setDescripcion(String descripcion) {
    this.descripcion = descripcion;
  }

  public String getDescripcion() {
    return descripcion;
  }
}