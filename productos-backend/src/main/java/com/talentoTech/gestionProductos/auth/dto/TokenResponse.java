package com.talentoTech.gestionProductos.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponse {
  private int status;
  private String message;
  private String token;
}
