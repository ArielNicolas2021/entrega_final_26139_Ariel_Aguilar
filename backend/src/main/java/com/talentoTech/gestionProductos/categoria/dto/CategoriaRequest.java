package com.talentoTech.gestionProductos.categoria.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CategoriaRequest {

  @NotBlank(message = "El nombre de la categoría es obligatoria.")
  private String nombre;

  @NotBlank(message = "La descripción de la categoría es obligatoria.")
  private String descripcion;

  @NotBlank(message = "El id del usuario es obligatorio.")
  @Min(value = 0, message = "El id del usuario no puede ser negativo.")
  private Long usuario;

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

  public Long getUsuario() {
    return usuario;
  }

  public void setUsuario(Long usuario) {
    this.usuario = usuario;
  }
}