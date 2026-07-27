package com.talentoTech.gestionProductos.auth.services;

import com.talentoTech.gestionProductos.auth.model.UsuarioModel;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final UsuarioRepository usuarioRepository;

  @Override
  public UserDetails loadUserByUsername(String email)
      throws UsernameNotFoundException {

    UsuarioModel usuario = usuarioRepository.findByEmail(email);
    if (usuario == null) {
      throw new UsernameNotFoundException("Usuario no encontrado con email: " + email);
    }

    return User.builder()
        .username(usuario.getEmail())
        .password(usuario.getPassword())
        .authorities("USER")
        .build();
  }
}