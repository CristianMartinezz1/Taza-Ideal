package com.tazaideal.dto;

import java.time.Instant;

/** Respuesta del login y del registro: token JWT y datos del usuario. */
public record AuthResponse(
        String token,
        String tipo,
        Instant expiraEn,
        UsuarioResponse usuario
) {

    public static AuthResponse bearer(String token, Instant expiraEn, UsuarioResponse usuario) {
        return new AuthResponse(token, "Bearer", expiraEn, usuario);
    }
}
