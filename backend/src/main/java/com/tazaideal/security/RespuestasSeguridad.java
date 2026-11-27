package com.tazaideal.security;

import com.tazaideal.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

/**
 * Respuestas JSON de Spring Security, con el mismo formato que GlobalExceptionHandler:
 * 401 cuando falta iniciar sesion y 403 cuando el rol no tiene permiso para la ruta.
 */
@Component
public class RespuestasSeguridad implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper json;

    public RespuestasSeguridad(ObjectMapper json) {
        this.json = json;
    }

    @Override
    public void commence(HttpServletRequest req, HttpServletResponse res, AuthenticationException ex) throws IOException {
        escribir(req, res, HttpStatus.UNAUTHORIZED, "Inicia sesión para continuar");
    }

    @Override
    public void handle(HttpServletRequest req, HttpServletResponse res, AccessDeniedException ex) throws IOException {
        escribir(req, res, HttpStatus.FORBIDDEN, "No tienes permiso para realizar esta acción");
    }

    private void escribir(HttpServletRequest req, HttpServletResponse res, HttpStatus estado, String mensaje) throws IOException {
        res.setStatus(estado.value());
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.setCharacterEncoding(StandardCharsets.UTF_8.name());
        json.writeValue(res.getOutputStream(), new ErrorResponse(Instant.now(), estado.value(),
                estado.getReasonPhrase(), mensaje, req.getRequestURI(), null));
    }
}
