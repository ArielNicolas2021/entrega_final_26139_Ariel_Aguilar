package com.talentoTech.gestionProductos.categoria.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaDTO {
  private Long id;

  @NotBlank(message = "El nombre de la categoría no puede estar vacío")
  private String nombre;

  @NotBlank(message = "La descripción de la categoría no puede estar vacía")
  private String descripcion;
  
  private Long usuarioID;
}