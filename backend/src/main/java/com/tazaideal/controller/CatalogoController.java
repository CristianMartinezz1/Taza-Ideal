package com.tazaideal.controller;

import com.tazaideal.dto.CategoriaResponse;
import com.tazaideal.dto.EtiquetaResponse;
import com.tazaideal.dto.PaginaResponse;
import com.tazaideal.dto.ProductoResponse;
import com.tazaideal.service.CategoriaService;
import com.tazaideal.service.ProductoService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Menu publico (no necesita sesion).
 * Ejemplo: GET /api/productos?q=latte&categoriaId=2&page=0&size=12&sort=precio,asc
 */
@RestController
@RequestMapping("/api")
public class CatalogoController {

    private final ProductoService productos;
    private final CategoriaService categorias;

    public CatalogoController(ProductoService productos, CategoriaService categorias) {
        this.productos = productos;
        this.categorias = categorias;
    }

    @GetMapping("/productos")
    public PaginaResponse<ProductoResponse> menu(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoriaId,
            @PageableDefault(size = 12, sort = "nombre", direction = Sort.Direction.ASC) Pageable pageable) {
        return productos.menu(q, categoriaId, pageable);
    }

    @GetMapping("/productos/{id}")
    public ProductoResponse producto(@PathVariable Long id) {
        return productos.obtener(id);
    }

    @GetMapping("/categorias")
    public List<CategoriaResponse> categorias() {
        return categorias.activas();
    }

    @GetMapping("/etiquetas")
    public List<EtiquetaResponse> etiquetas() {
        return productos.etiquetas();
    }
}
