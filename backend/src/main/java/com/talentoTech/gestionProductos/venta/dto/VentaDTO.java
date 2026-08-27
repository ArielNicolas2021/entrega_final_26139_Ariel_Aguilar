package com.talentoTech.gestionProductos.venta.dto;

import java.util.List;

import com.talentoTech.gestionProductos.detalle_venta.dto.DetalleVentaDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaDTO {
  private Long id;

  @NotBlank(message = "La fecha es obligatoria")
  private String fecha;

  private double total;
  private Long usuarioId;

  @NotEmpty(message = "La venta debe tener al menos un detalle")
  @Valid
  private List<DetalleVentaDTO> detalleVenta;
}
