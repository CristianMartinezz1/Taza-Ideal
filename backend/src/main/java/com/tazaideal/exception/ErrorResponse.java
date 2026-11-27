package com.tazaideal.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

/**
 * Formato unico de todos los errores de la API, por ejemplo:
 * {
 *   "fecha": "2026-11-27T14:00:00Z",
 *   "estado": 400,
 *   "error": "Bad Request",
 *   "mensaje": "Revisa los datos del formulario",
 *   "ruta": "/api/auth/registro",
 *   "errores": { "correo": "El correo no es válido" }
 * }
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        Instant fecha,
        int estado,
        String error,
        String mensaje,
        String ruta,
        /** Solo en errores de validacion (400): campo -> mensaje. */
        Map<String, String> errores
) {
}
