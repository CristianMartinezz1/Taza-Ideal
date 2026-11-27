package com.tazaideal.service;

import com.tazaideal.dto.EtiquetaResponse;
import com.tazaideal.dto.PaginaResponse;
import com.tazaideal.dto.ProductoRequest;
import com.tazaideal.dto.ProductoResponse;
import com.tazaideal.exception.RecursoNoEncontradoException;
import com.tazaideal.exception.ReglaNegocioException;
import com.tazaideal.model.Etiqueta;
import com.tazaideal.model.Producto;
import com.tazaideal.repository.EtiquetaRepository;
import com.tazaideal.repository.ProductoRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProductoService {

    private final ProductoRepository productos;
    private final EtiquetaRepository etiquetas;
    private final CategoriaService categorias;
    private final AlmacenamientoService almacenamiento;

    public ProductoService(ProductoRepository productos, EtiquetaRepository etiquetas,
                           CategoriaService categorias, AlmacenamientoService almacenamiento) {
        this.productos = productos;
        this.etiquetas = etiquetas;
        this.categorias = categorias;
        this.almacenamiento = almacenamiento;
    }

    // ---------- publico (menu) ----------

    /** Menu: solo productos disponibles, con busqueda, filtro por categoria y paginacion. */
    @Transactional(readOnly = true)
    public PaginaResponse<ProductoResponse> menu(String q, Long categoriaId, Pageable pageable) {
        return PaginaResponse.de(productos.buscar(Texto.limpio(q), categoriaId, true, pageable), ProductoResponse::de);
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtener(Long id) {
        return ProductoResponse.de(buscarConDetalle(id));
    }

    @Transactional(readOnly = true)
    public List<EtiquetaResponse> etiquetas() {
        return etiquetas.findAllByOrderByNombreAsc().stream().map(EtiquetaResponse::de).toList();
    }

    // ---------- administrador ----------

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public PaginaResponse<ProductoResponse> buscar(String q, Long categoriaId, Boolean disponible, Pageable pageable) {
        return PaginaResponse.de(productos.buscar(Texto.limpio(q), categoriaId, disponible, pageable), ProductoResponse::de);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ProductoResponse crear(ProductoRequest req) {
        String nombre = req.nombre().trim();
        if (productos.existsByNombreIgnoreCase(nombre)) {
            throw new ReglaNegocioException("Ya existe un producto llamado " + nombre);
        }
        Producto p = new Producto();
        aplicar(p, req);
        return ProductoResponse.de(productos.save(p));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest req) {
        Producto p = buscarConDetalle(id);
        String nombre = req.nombre().trim();
        if (productos.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw new ReglaNegocioException("Ya existe un producto llamado " + nombre);
        }
        aplicar(p, req);
        return ProductoResponse.de(p);
    }

    /**
     * Si el producto ya aparece en pedidos o en resultados de la encuesta no se borra
     * (se perderia el historial): se pide desactivarlo con disponible = false.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void eliminar(Long id) {
        Producto p = buscarConDetalle(id);
        if (productos.tienePedidos(id) || productos.tieneResultadosEncuesta(id)) {
            throw new ReglaNegocioException(
                    "El producto ya tiene pedidos o recomendaciones. Márcalo como no disponible en lugar de eliminarlo");
        }
        String foto = p.getImagenUrl();
        productos.delete(p);
        almacenamiento.borrar(foto);
    }

    /** Sube o reemplaza la foto del producto (JPG o PNG, maximo 2 MB). */
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ProductoResponse subirFoto(Long id, MultipartFile archivo) {
        Producto p = buscarConDetalle(id);
        String anterior = p.getImagenUrl();
        p.setImagenUrl(almacenamiento.guardarFotoProducto(archivo));
        almacenamiento.borrar(anterior);
        return ProductoResponse.de(p);
    }

    // ---------- apoyo ----------

    private void aplicar(Producto p, ProductoRequest req) {
        p.setNombre(req.nombre().trim());
        p.setDescripcion(Texto.vacioANull(req.descripcion()));
        p.setPrecio(req.precio());
        p.setCategoria(categorias.buscarPorId(req.categoriaId()));
        if (req.disponible() != null) {
            p.setDisponible(req.disponible());
        }
        if (req.etiquetaIds() != null) {
            List<Etiqueta> encontradas = etiquetas.findAllById(req.etiquetaIds());
            if (encontradas.size() != req.etiquetaIds().size()) {
                throw new ReglaNegocioException("Alguna de las etiquetas seleccionadas no existe");
            }
            Set<Etiqueta> nuevas = new HashSet<>(encontradas);
            p.getEtiquetas().clear();
            p.getEtiquetas().addAll(nuevas);
        }
    }

    private Producto buscarConDetalle(Long id) {
        return productos.findConDetalleById(id).orElseThrow(() -> new RecursoNoEncontradoException("Producto", id));
    }
}
