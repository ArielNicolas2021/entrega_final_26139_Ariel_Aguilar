package com.talentoTech.gestionProductos.auth.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.auth.dto.AuthResponse;
import com.talentoTech.gestionProductos.auth.dto.LoginRequest;
import com.talentoTech.gestionProductos.auth.dto.RegisterRequest;
import com.talentoTech.gestionProductos.auth.exceptions.InvalidPasswordException;
import com.talentoTech.gestionProductos.auth.exceptions.UserNotFoundException;
import com.talentoTech.gestionProductos.auth.model.UsuarioModel;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado.");
        }

        UsuarioModel usuario = UsuarioModel.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        usuarioRepository.save(usuario);

        return "Usuario registrado correctamente.";
    }

    public AuthResponse login(LoginRequest request) {
        UsuarioModel usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado."));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new InvalidPasswordException("Contraseña incorrecta.");
        }

        String token = jwtService.generateToken(usuario.getEmail());
        return new AuthResponse(token);
    }
}