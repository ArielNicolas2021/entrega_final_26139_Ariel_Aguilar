package com.talentoTech.gestionProductos.auth.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterDTO {
  private int status;
  private String message;
  private UsuarioDTO usuario;
}
