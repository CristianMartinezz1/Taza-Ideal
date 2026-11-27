package com.tazaideal.controller;

import com.tazaideal.dto.*;
import com.tazaideal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints de cuenta y sesion.
 * Publicos: registro, login, recuperar, restablecer.
 * Con sesion: yo, verificar, reenviar-codigo, logout.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registro(@Valid @RequestBody RegistroRequest req) {
        return auth.registrar(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return auth.login(req);
    }

    @GetMapping("/yo")
    public UsuarioResponse yo() {
        return auth.yo();
    }

    @PostMapping("/verificar")
    public UsuarioResponse verificar(@Valid @RequestBody VerificarCorreoRequest req) {
        return auth.verificarCorreo(req);
    }

    @PostMapping("/reenviar-codigo")
    public MensajeResponse reenviarCodigo() {
        return auth.reenviarCodigo();
    }

    @PostMapping("/logout")
    public MensajeResponse logout() {
        return auth.logout();
    }

    @PostMapping("/recuperar")
    public MensajeResponse recuperar(@Valid @RequestBody RecuperarRequest req) {
        return auth.recuperar(req);
    }

    @PostMapping("/restablecer")
    public MensajeResponse restablecer(@Valid @RequestBody RestablecerRequest req) {
        return auth.restablecer(req);
    }
}
