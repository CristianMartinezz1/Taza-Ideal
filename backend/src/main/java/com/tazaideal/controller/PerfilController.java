package com.tazaideal.controller;

import com.tazaideal.dto.CambiarContrasenaRequest;
import com.tazaideal.dto.MensajeResponse;
import com.tazaideal.dto.PerfilRequest;
import com.tazaideal.dto.UsuarioResponse;
import com.tazaideal.service.PerfilService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** Perfil del usuario con sesion iniciada (cliente, barista o administrador). */
@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final PerfilService perfil;

    public PerfilController(PerfilService perfil) {
        this.perfil = perfil;
    }

    @GetMapping
    public UsuarioResponse ver() {
        return perfil.ver();
    }

    @PutMapping
    public UsuarioResponse actualizar(@Valid @RequestBody PerfilRequest req) {
        return perfil.actualizar(req);
    }

    @PutMapping("/contrasena")
    public MensajeResponse cambiarContrasena(@Valid @RequestBody CambiarContrasenaRequest req) {
        return perfil.cambiarContrasena(req);
    }
}
