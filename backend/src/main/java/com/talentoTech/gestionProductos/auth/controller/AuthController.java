package com.talentoTech.gestionProductos.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.talentoTech.gestionProductos.auth.dto.LoginDTO;
import com.talentoTech.gestionProductos.auth.dto.RegisterDTO;
import com.talentoTech.gestionProductos.auth.dto.TokenResponse;
import com.talentoTech.gestionProductos.auth.dto.UsuarioDTO;
import com.talentoTech.gestionProductos.auth.services.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<RegisterDTO> register(@Valid @RequestBody UsuarioDTO user) {
        RegisterDTO response = usuarioService.register(user);
        if (response.getStatus() == 400) {
            return ResponseEntity.status(400).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginDTO user) {
        if (usuarioService.login(user).getStatus() == 400) {
            return ResponseEntity.status(400).body(usuarioService.login(user));
        }

        return ResponseEntity.ok(usuarioService.login(user));
    }
}