package com.tazaideal.security;

import com.tazaideal.model.NombreRol;

import java.time.Instant;

/**
 * Quien hace la peticion. Lo crea el filtro JWT y queda guardado en el SecurityContext.
 * jti y expiraEn sirven para invalidar el token al cerrar sesion.
 */
public record UsuarioAutenticado(
        Long id,
        String correo,
        String nombre,
        NombreRol rol,
        String jti,
        Instant expiraEn
) {
}
