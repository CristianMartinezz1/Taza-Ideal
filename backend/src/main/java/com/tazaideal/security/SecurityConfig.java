package com.tazaideal.security;

import com.tazaideal.repository.TokenRevocadoRepository;
import com.tazaideal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Reglas de acceso de la API:
 * - Publico: registro, login, recuperar contrasena, y consultar el menu (GET de productos y categorias).
 * - /api/barista/**: rol BARISTA (y ADMIN, que tiene acceso total).
 * - /api/admin/**: solo rol ADMIN.
 * - Todo lo demas: cualquier usuario con sesion iniciada.
 * Sin sesiones en el servidor (STATELESS): cada peticion trae su token JWT.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // habilita @PreAuthorize en los servicios
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filtro(HttpSecurity http,
                                      JwtService jwt,
                                      UsuarioRepository usuarios,
                                      TokenRevocadoRepository revocados,
                                      RespuestasSeguridad respuestas) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // API con JWT, sin cookies de sesion
                .cors(c -> {
                })
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST,
                                "/api/auth/registro", "/api/auth/login",
                                "/api/auth/recuperar", "/api/auth/restablecer").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/productos/**", "/api/categorias/**", "/api/etiquetas/**",
                                "/uploads/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/barista/**").hasAnyRole("BARISTA", "ADMIN")
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(respuestas) // 401 en JSON
                        .accessDeniedHandler(respuestas))     // 403 en JSON
                .addFilterBefore(new JwtAuthFilter(jwt, usuarios, revocados),
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /** BCrypt para guardar y comparar contrasenas (nunca en texto plano). */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Usuarios desde la base de datos. Evita que Spring cree un usuario de prueba
     * con contrasena aleatoria y sirve si se usa AuthenticationManager.
     */
    @Bean
    public UserDetailsService userDetailsService(UsuarioRepository usuarios) {
        return correo -> usuarios.findByCorreoIgnoreCase(correo)
                .map(u -> User.withUsername(u.getCorreo())
                        .password(u.getContrasena())
                        .roles(u.getRol().getNombre().name())
                        .disabled(!u.isActivo())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    /** Origenes permitidos para el frontend (app.cors.origenes, separados por coma). */
    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.origenes:http://localhost:5173}") String origenes) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.stream(origenes.split(",")).map(String::trim).toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource fuente = new UrlBasedCorsConfigurationSource();
        fuente.registerCorsConfiguration("/api/**", config);
        return fuente;
    }
}
