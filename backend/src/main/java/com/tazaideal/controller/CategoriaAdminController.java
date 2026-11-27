package com.tazaideal.controller;

import com.tazaideal.dto.CategoriaRequest;
import com.tazaideal.dto.CategoriaResponse;
import com.tazaideal.dto.PaginaResponse;
import com.tazaideal.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** CRUD de categorias para el administrador (protegido por rol ADMIN). */
@RestController
@RequestMapping("/api/admin/categorias")
public class CategoriaAdminController {

    private final CategoriaService categorias;

    public CategoriaAdminController(CategoriaService categorias) {
        this.categorias = categorias;
    }

    @GetMapping
    public PaginaResponse<CategoriaResponse> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean activo,
            @PageableDefault(size = 10, sort = "nombre", direction = Sort.Direction.ASC) Pageable pageable) {
        return categorias.buscar(q, activo, pageable);
    }

    @GetMapping("/{id}")
    public CategoriaResponse obtener(@PathVariable Long id) {
        return categorias.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaResponse crear(@Valid @RequestBody CategoriaRequest req) {
        return categorias.crear(req);
    }

    @PutMapping("/{id}")
    public CategoriaResponse actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest req) {
        return categorias.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        categorias.eliminar(id);
    }
}
