package com.talentoTech.gestionProductos.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.talentoTech.gestionProductos.auth.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);

    boolean existsByEmail(String email);
}