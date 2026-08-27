package com.talentoTech.gestionProductos.detalle_venta.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DetalleVentaRequest {
  @Positive(message = "La cantidad debe ser mayor a 0")
  private int cantidad;
  @NotNull(message = "El producto es obligatorio")
  private Long productoID;
}
