package com.talentoTech.gestionProductos.detalle_venta.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleVentaDTO {
  private Long id;

  @Positive(message = "La cantidad debe ser mayor a 0")
  private int cantidad;

  private double precio_unitario;
  private double subtotal;
  private Long ventaID;

  @NotNull(message = "El producto es obligatorio")
  private Long productoID;

  private Long usuarioID;
}
