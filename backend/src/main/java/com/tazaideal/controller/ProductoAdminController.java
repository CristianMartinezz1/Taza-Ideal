package com.tazaideal.controller;

import com.tazaideal.dto.PaginaResponse;
import com.tazaideal.dto.ProductoRequest;
import com.tazaideal.dto.ProductoResponse;
import com.tazaideal.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/** CRUD de productos para el administrador (protegido por rol ADMIN). */
@RestController
@RequestMapping("/api/admin/productos")
public class ProductoAdminController {

    private final ProductoService productos;

    public ProductoAdminController(ProductoService productos) {
        this.productos = productos;
    }

    @GetMapping
    public PaginaResponse<ProductoResponse> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Boolean disponible,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return productos.buscar(q, categoriaId, disponible, pageable);
    }

    @GetMapping("/{id}")
    public ProductoResponse obtener(@PathVariable Long id) {
        return productos.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoResponse crear(@Valid @RequestBody ProductoRequest req) {
        return productos.crear(req);
    }

    @PutMapping("/{id}")
    public ProductoResponse actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequest req) {
        return productos.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        productos.eliminar(id);
    }

    /** Sube la foto como multipart/form-data con el campo "archivo". */
    @PostMapping(value = "/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductoResponse subirFoto(@PathVariable Long id, @RequestParam("archivo") MultipartFile archivo) {
        return productos.subirFoto(id, archivo);
    }
}
