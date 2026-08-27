package com.talentoTech.gestionProductos.auth.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
  private Long id;

  @NotBlank(message = "El nombre es obligatorio")
  private String nombre;

  @NotBlank(message = "El correo electrónico es obligatorio")
  @Email(message = "El correo electrónico debe tener un formato válido")
  private String email;

  @NotBlank(message = "La contraseña es obligatoria")
  private String password;
}
