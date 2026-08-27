package com.talentoTech.gestionProductos.venta.dto;

import java.util.List;

import com.talentoTech.gestionProductos.detalle_venta.dto.DetalleVentaRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaRequest {
  @NotBlank(message = "La fecha es obligatoria")
  private String fecha;
  
  @NotEmpty(message = "La venta debe tener al menos un detalle")
  @Valid
  private List<DetalleVentaRequest> detalleVenta;
}
