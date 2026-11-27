package com.tazaideal.dto;

import com.tazaideal.model.NombreRol;
import jakarta.validation.constraints.*;

/**
 * Alta y edicion de usuarios por el administrador.
 * Al crear, la contrasena es obligatoria (lo revisa el servicio);
 * al editar puede ir vacia para conservar la actual.
 */
public record UsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        String nombre,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido")
        @Size(max = 150, message = "El correo es demasiado largo")
        String correo,

        @Pattern(regexp = Validaciones.CONTRASENA, message = Validaciones.CONTRASENA_MSG)
        String contrasena,

        @NotNull(message = "El rol es obligatorio")
        NombreRol rol,

        @Pattern(regexp = Validaciones.TELEFONO, message = Validaciones.TELEFONO_MSG)
        String telefono,

        Boolean activo
) {
}
