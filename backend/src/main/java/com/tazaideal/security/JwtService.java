package com.tazaideal.security;

import com.tazaideal.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

/**
 * Genera y valida los tokens JWT (firmados con HMAC-SHA).
 * El token lleva: sub = correo, uid = id del usuario, rol, jti (id unico) y fecha de vencimiento.
 */
@Service
public class JwtService {

    private final SecretKey llave;
    private final Duration duracion;

    public JwtService(@Value("${app.jwt.secreto}") String secretoBase64,
                      @Value("${app.jwt.expiracion-minutos:120}") long minutos) {
        // El secreto viene en Base64 y debe tener al menos 256 bits
        this.llave = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretoBase64));
        this.duracion = Duration.ofMinutes(minutos);
    }

    /** Resultado de generar un token: el texto del token, su jti y cuando vence. */
    public record TokenGenerado(String token, String jti, Instant expiraEn) {
    }

    public TokenGenerado generar(Usuario usuario) {
        Instant ahora = Instant.now();
        Instant expira = ahora.plus(duracion);
        String jti = UUID.randomUUID().toString();
        String token = Jwts.builder()
                .id(jti)
                .subject(usuario.getCorreo())
                .claim("uid", usuario.getId())
                .claim("rol", usuario.getRol().getNombre().name())
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(expira))
                .signWith(llave)
                .compact();
        return new TokenGenerado(token, jti, expira);
    }

    /**
     * Verifica la firma y la fecha de vencimiento.
     * @throws JwtException si el token es falso, fue modificado o ya vencio
     */
    public Claims validar(String token) {
        return Jwts.parser()
                .verifyWith(llave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
