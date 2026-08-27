package com.talentoTech.gestionProductos.producto.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDTO {
  private Long id;

  @NotBlank(message = "El nombre no puede estar vacío")
  private String nombre;

  @NotNull(message = "El precio no puede ser nulo")
  @Min(value = 1, message = "El precio debe ser mayor a 0")
  private double precio;

  @NotNull(message = "El stock no puede ser nulo")
  @Min(value = 0, message = "El stock debe ser mayor o igual a 0")
  private int stock;

  private String categoria;

  @NotNull(message = "La categoría no puede ser nula")
  private Long categoriaID;
  
  private Long usuarioID;
}
