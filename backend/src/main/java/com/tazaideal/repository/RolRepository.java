package com.tazaideal.repository;

import com.tazaideal.model.NombreRol;
import com.tazaideal.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByNombre(NombreRol nombre);
}
