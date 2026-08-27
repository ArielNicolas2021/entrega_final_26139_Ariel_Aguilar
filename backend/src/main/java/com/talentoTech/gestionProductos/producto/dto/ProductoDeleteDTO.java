package com.talentoTech.gestionProductos.producto.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDeleteDTO {
  private int status;
  private String message;
}
