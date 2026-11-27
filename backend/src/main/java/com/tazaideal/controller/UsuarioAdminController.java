package com.tazaideal.controller;

import com.tazaideal.dto.PaginaResponse;
import com.tazaideal.dto.UsuarioRequest;
import com.tazaideal.dto.UsuarioResponse;
import com.tazaideal.model.NombreRol;
import com.tazaideal.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * CRUD de usuarios para el administrador.
 * Ejemplo: GET /api/admin/usuarios?q=ana&rol=CLIENTE&activo=true&page=0&size=10
 */
@RestController
@RequestMapping("/api/admin/usuarios")
public class UsuarioAdminController {

    private final UsuarioService usuarios;

    public UsuarioAdminController(UsuarioService usuarios) {
        this.usuarios = usuarios;
    }

    @GetMapping
    public PaginaResponse<UsuarioResponse> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) NombreRol rol,
            @RequestParam(required = false) Boolean activo,
            @PageableDefault(size = 10, sort = "nombre", direction = Sort.Direction.ASC) Pageable pageable) {
        return usuarios.buscar(q, rol, activo, pageable);
    }

    @GetMapping("/{id}")
    public UsuarioResponse obtener(@PathVariable Long id) {
        return usuarios.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse crear(@Valid @RequestBody UsuarioRequest req) {
        return usuarios.crear(req);
    }

    @PutMapping("/{id}")
    public UsuarioResponse actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequest req) {
        return usuarios.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        usuarios.eliminar(id);
    }
}
