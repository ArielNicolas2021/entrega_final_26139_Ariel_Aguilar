package com.talentoTech.gestionProductos.auth.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.talentoTech.gestionProductos.auth.dto.LoginDTO;
import com.talentoTech.gestionProductos.auth.dto.TokenResponse;
import com.talentoTech.gestionProductos.auth.dto.UsuarioDTO;
import com.talentoTech.gestionProductos.auth.dto.RegisterDTO;
import com.talentoTech.gestionProductos.auth.model.Usuario;
import com.talentoTech.gestionProductos.auth.repository.UsuarioRepository;
import com.talentoTech.gestionProductos.mapper.Mapper;

@Service
public class UsuarioService {
    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtService jwtService;

    public RegisterDTO register(UsuarioDTO user) {
        if (usuarioRepository.existsByEmail(user.getEmail())) {
            return new RegisterDTO(400, "El correo electrónico ya está registrado", null);
        }
        
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(user.getNombre());
        nuevoUsuario.setEmail(user.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(user.getPassword()));

        Usuario saveUsuario = usuarioRepository.save(nuevoUsuario);

        return new RegisterDTO(200, "Usuario registrado exitosamente", Mapper.toDTO(saveUsuario));
    }

    public TokenResponse login(LoginDTO user) {
        Usuario usuario = usuarioRepository.findByEmail(user.getEmail());

        if (usuario == null) {
            return new TokenResponse(400, "Usuario no encontrado", null, null);
        }

        if (!passwordEncoder.matches(user.getPassword(), usuario.getPassword())) {
            return new TokenResponse(400, "Contraseña incorrecta", null, null);
        }

        String token = jwtService.generateToken(usuario.getEmail());

        return new TokenResponse(200, "Login exitoso", token, usuario.getId());
    }
}