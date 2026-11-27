package com.tazaideal.service;

import com.tazaideal.dto.CategoriaRequest;
import com.tazaideal.dto.CategoriaResponse;
import com.tazaideal.dto.PaginaResponse;
import com.tazaideal.exception.RecursoNoEncontradoException;
import com.tazaideal.exception.ReglaNegocioException;
import com.tazaideal.model.Categoria;
import com.tazaideal.repository.CategoriaRepository;
import com.tazaideal.repository.ProductoRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categorias;
    private final ProductoRepository productos;

    public CategoriaService(CategoriaRepository categorias, ProductoRepository productos) {
        this.categorias = categorias;
        this.productos = productos;
    }

    /** Categorias activas para el filtro del menu (publico). */
    @Transactional(readOnly = true)
    public List<CategoriaResponse> activas() {
        return categorias.findByActivoTrueOrderByNombreAsc().stream().map(CategoriaResponse::de).toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public PaginaResponse<CategoriaResponse> buscar(String q, Boolean activo, Pageable pageable) {
        return PaginaResponse.de(categorias.buscar(Texto.limpio(q), activo, pageable), CategoriaResponse::de);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public CategoriaResponse obtener(Long id) {
        return CategoriaResponse.de(buscarPorId(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public CategoriaResponse crear(CategoriaRequest req) {
        String nombre = req.nombre().trim();
        if (categorias.existsByNombreIgnoreCase(nombre)) {
            throw new ReglaNegocioException("Ya existe una categoría llamada " + nombre);
        }
        Categoria c = new Categoria();
        aplicar(c, req);
        return CategoriaResponse.de(categorias.save(c));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest req) {
        Categoria c = buscarPorId(id);
        String nombre = req.nombre().trim();
        if (categorias.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw new ReglaNegocioException("Ya existe una categoría llamada " + nombre);
        }
        aplicar(c, req);
        return CategoriaResponse.de(c);
    }

    /** Solo se puede eliminar si no tiene productos; si los tiene, mejor desactivarla. */
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void eliminar(Long id) {
        Categoria c = buscarPorId(id);
        if (productos.existsByCategoriaId(id)) {
            throw new ReglaNegocioException("La categoría tiene productos. Muévelos o desactiva la categoría");
        }
        categorias.delete(c);
    }

    private void aplicar(Categoria c, CategoriaRequest req) {
        c.setNombre(req.nombre().trim());
        c.setDescripcion(Texto.vacioANull(req.descripcion()));
        if (req.activo() != null) {
            c.setActivo(req.activo());
        }
    }

    Categoria buscarPorId(Long id) {
        return categorias.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Categoría", id));
    }
}
