package com.tazaideal.security;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** Atajo para que los servicios sepan quien hace la peticion. */
public final class UsuarioActual {

    private UsuarioActual() {
    }

    public static UsuarioAutenticado obtener() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UsuarioAutenticado u) {
            return u;
        }
        throw new AuthenticationCredentialsNotFoundException("No hay sesión iniciada");
    }

    public static Long id() {
        return obtener().id();
    }
}
