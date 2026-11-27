package com.tazaideal.dto;

import com.tazaideal.model.NombreRol;
import com.tazaideal.model.Usuario;

import java.time.LocalDateTime;

/** Datos publicos de un usuario. Nunca incluye la contrasena ni el codigo de verificacion. */
public record UsuarioResponse(
        Long id,
        String nombre,
        String correo,
        String telefono,
        String avatarUrl,
        NombreRol rol,
        boolean activo,
        boolean correoVerificado,
        LocalDateTime creadoEn
) {

    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(
                u.getId(),
                u.getNombre(),
                u.getCorreo(),
                u.getTelefono(),
                u.getAvatarUrl(),
                u.getRol().getNombre(),
                u.isActivo(),
                u.isCorreoVerificado(),
                u.getCreadoEn());
    }
}
