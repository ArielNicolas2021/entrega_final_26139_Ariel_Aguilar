package com.talentoTech.gestionProductos.auth.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.auth.dto.ApiResponse;
import com.talentoTech.gestionProductos.auth.dto.LoginRequest;
import com.talentoTech.gestionProductos.auth.dto.RegisterRequest;
import com.talentoTech.gestionProductos.auth.dto.TokenResponse;
import com.talentoTech.gestionProductos.auth.model.UsuarioModel;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public ApiResponse register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(400, "El correo electrónico ya está en uso.");
        }

        UsuarioModel usuario = UsuarioModel.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        usuarioRepository.save(usuario);

        return new ApiResponse(200, "Usuario registrado exitosamente.");
    }

    public TokenResponse login(LoginRequest request) {
        UsuarioModel usuario = usuarioRepository.findByEmail(request.getEmail());
                if (usuario == null) {
                    return new TokenResponse(400, "Usuario no encontrado", null, null);
                }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return new TokenResponse(400, "Contraseña incorrecta", null, null);
        }

        String token = jwtService.generateToken(usuario.getEmail());
        return new TokenResponse(200, "Login exitoso", token, usuario.getId());
    }
}