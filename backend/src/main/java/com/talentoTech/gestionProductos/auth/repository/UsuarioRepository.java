package com.talentoTech.gestionProductos.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.talentoTech.gestionProductos.auth.model.UsuarioModel;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {

    UsuarioModel findByEmail(String email);

    boolean existsByEmail(String email);

}