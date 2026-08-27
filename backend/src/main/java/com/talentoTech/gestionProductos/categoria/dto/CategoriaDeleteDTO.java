package com.talentoTech.gestionProductos.categoria.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaDeleteDTO {
  private int status;
  private String message;
}
