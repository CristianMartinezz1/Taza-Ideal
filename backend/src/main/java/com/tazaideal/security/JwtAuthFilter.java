package com.tazaideal.security;

import com.tazaideal.model.Usuario;
import com.tazaideal.repository.TokenRevocadoRepository;
import com.tazaideal.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Lee el encabezado "Authorization: Bearer <token>" en cada peticion.
 * Si el token es valido, no fue revocado (logout) y el usuario sigue activo,
 * marca la peticion como autenticada con el rol del usuario.
 * Si algo falla, la peticion sigue como anonima y Spring Security responde 401
 * cuando la ruta lo exige.
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String PREFIJO = "Bearer ";

    private final JwtService jwt;
    private final UsuarioRepository usuarios;
    private final TokenRevocadoRepository revocados;

    public JwtAuthFilter(JwtService jwt, UsuarioRepository usuarios, TokenRevocadoRepository revocados) {
        this.jwt = jwt;
        this.usuarios = usuarios;
        this.revocados = revocados;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String encabezado = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (encabezado != null && encabezado.startsWith(PREFIJO)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            autenticar(encabezado.substring(PREFIJO.length()).trim(), request);
        }
        chain.doFilter(request, response);
    }

    private void autenticar(String token, HttpServletRequest request) {
        Claims claims;
        try {
            claims = jwt.validar(token);
        } catch (JwtException | IllegalArgumentException e) {
            return; // token falso, modificado o vencido
        }
        if (claims.getId() == null || revocados.existsByJti(claims.getId())) {
            return; // el usuario cerro sesion con este token
        }
        Optional<Usuario> encontrado = usuarios.findByCorreoIgnoreCase(claims.getSubject());
        if (encontrado.isEmpty() || !encontrado.get().isActivo()) {
            return; // el usuario fue eliminado o desactivado
        }
        Usuario u = encontrado.get();
        UsuarioAutenticado principal = new UsuarioAutenticado(u.getId(), u.getCorreo(), u.getNombre(),
                u.getRol().getNombre(), claims.getId(), claims.getExpiration().toInstant());
        var auth = new UsernamePasswordAuthenticationToken(principal, null,
                List.of(new SimpleGrantedAuthority("ROLE_" + u.getRol().getNombre().name())));
        auth.setDetails(request.getRemoteAddr());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
