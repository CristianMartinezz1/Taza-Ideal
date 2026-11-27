package com.tazaideal.service;

import com.tazaideal.dto.EncuestaRequest;
import com.tazaideal.dto.RecomendacionResponse;
import com.tazaideal.exception.RecursoNoEncontradoException;
import com.tazaideal.exception.ReglaNegocioException;
import com.tazaideal.model.Etiqueta;
import com.tazaideal.model.Producto;
import com.tazaideal.model.ResultadoEncuesta;
import com.tazaideal.model.Usuario;
import com.tazaideal.repository.ProductoRepository;
import com.tazaideal.repository.ResultadoEncuestaRepository;
import com.tazaideal.repository.UsuarioRepository;
import com.tazaideal.security.UsuarioActual;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.*;

/**
 * Recomienda bebidas segun las 6 respuestas de la encuesta.
 *
 * Cada respuesta se traduce a una etiqueta de sabor con un peso. Por cada bebida se suman
 * los pesos de las etiquetas que coinciden (y se resta si lleva chocolate y el cliente dijo que no).
 * El porcentaje es: puntos obtenidos / puntos maximos posibles. Se devuelven las 3 mejores.
 */
@Service
public class EncuestaService {

    /** Una preferencia: la etiqueta buscada, cuanto vale y la razon que se muestra al cliente. */
    private record Criterio(String etiqueta, int peso, String razon) {
    }

    private static final String PARA_COMER = "para comer";
    private static final int TOTAL_RECOMENDACIONES = 3;

    private final ProductoRepository productos;
    private final ResultadoEncuestaRepository resultados;
    private final UsuarioRepository usuarios;
    private final ObjectMapper json;

    public EncuestaService(ProductoRepository productos, ResultadoEncuestaRepository resultados,
                           UsuarioRepository usuarios, ObjectMapper json) {
        this.productos = productos;
        this.resultados = resultados;
        this.usuarios = usuarios;
        this.json = json;
    }

    /** Calcula las 3 bebidas recomendadas y guarda la mejor en resultados_encuesta. */
    @Transactional
    public List<RecomendacionResponse> responder(EncuestaRequest req) {
        List<Criterio> criterios = criterios(req);
        int maximo = criterios.stream().mapToInt(Criterio::peso).sum();
        boolean evitaChocolate = "no".equals(req.chocolate());

        List<RecomendacionResponse> ranking = productos.findDisponiblesConEtiquetas().stream()
                .filter(this::esBebida)
                .map(p -> puntuar(p, criterios, maximo, evitaChocolate))
                .sorted(Comparator.comparingInt(RecomendacionResponse::coincidencia).reversed()
                        .thenComparing(RecomendacionResponse::nombre))
                .limit(TOTAL_RECOMENDACIONES)
                .toList();
        if (ranking.isEmpty()) {
            throw new ReglaNegocioException("Por ahora no hay bebidas disponibles para recomendar");
        }

        Usuario usuario = usuarios.findById(UsuarioActual.id())
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", UsuarioActual.id()));
        RecomendacionResponse mejor = ranking.getFirst();
        ResultadoEncuesta r = new ResultadoEncuesta();
        r.setUsuario(usuario);
        r.setProducto(productos.getReferenceById(mejor.productoId()));
        r.setRespuestas(json.writeValueAsString(req));
        r.setCoincidencia(mejor.coincidencia());
        resultados.save(r);
        return ranking;
    }

    /** Ultima recomendacion guardada del cliente (para mostrarla en Inicio). */
    @Transactional(readOnly = true)
    public RecomendacionResponse ultima() {
        ResultadoEncuesta r = resultados.findFirstByUsuarioIdOrderByCreadoEnDescIdDesc(UsuarioActual.id())
                .orElseThrow(() -> new RecursoNoEncontradoException("Todavía no has contestado la encuesta"));
        Producto p = r.getProducto();
        return new RecomendacionResponse(p.getId(), p.getNombre(), p.getImagenUrl(), p.getPrecio(),
                r.getCoincidencia(), List.of());
    }

    // ---------- calculo ----------

    /** Traduce cada respuesta a la etiqueta que se busca en las bebidas. */
    private List<Criterio> criterios(EncuestaRequest req) {
        List<Criterio> c = new ArrayList<>();
        c.add("caliente".equals(req.temperatura())
                ? new Criterio("caliente", 3, "Es una bebida caliente")
                : new Criterio("fria", 3, "Es una bebida fría"));
        switch (req.sabor()) {
            case "dulce" -> c.add(new Criterio("dulce", 2, "Tiene un sabor dulce"));
            case "amargo" -> c.add(new Criterio("intenso", 2, "Tiene un sabor intenso"));
            case "especiado" -> c.add(new Criterio("especiado", 2, "Tiene notas especiadas"));
            default -> c.add(new Criterio("suave", 2, "Tiene un sabor equilibrado"));
        }
        c.add("si".equals(req.leche())
                ? new Criterio("con leche", 2, "Lleva leche")
                : new Criterio("sin leche", 2, "No lleva leche"));
        switch (req.intensidad()) {
            case "suave" -> c.add(new Criterio("suave", 2, "Es suave"));
            case "fuerte" -> c.add(new Criterio("intenso", 2, "Es intensa"));
            default -> { } // intensidad media: no suma ni resta
        }
        if ("si".equals(req.chocolate())) {
            c.add(new Criterio("chocolate", 2, "Lleva chocolate"));
        }
        switch (req.momento()) {
            case "manana" -> c.add(new Criterio("intenso", 1, "Ideal para empezar el día"));
            case "tarde" -> c.add(new Criterio("dulce", 1, "Perfecta para la tarde"));
            default -> c.add(new Criterio("suave", 1, "Ligera para la noche"));
        }
        return c;
    }

    private RecomendacionResponse puntuar(Producto p, List<Criterio> criterios, int maximo, boolean evitaChocolate) {
        Set<String> etiquetas = nombres(p);
        int puntos = 0;
        List<String> razones = new ArrayList<>();
        for (Criterio c : criterios) {
            if (etiquetas.contains(c.etiqueta())) {
                puntos += c.peso();
                if (!razones.contains(c.razon())) {
                    razones.add(c.razon());
                }
            }
        }
        if (evitaChocolate && etiquetas.contains("chocolate")) {
            puntos -= 1;
        }
        int porcentaje = maximo == 0 ? 0 : Math.max(0, Math.round(puntos * 100f / maximo));
        return new RecomendacionResponse(p.getId(), p.getNombre(), p.getImagenUrl(), p.getPrecio(),
                Math.min(porcentaje, 100), razones);
    }

    /** Solo bebidas: se descartan el pan y los granos (no son ni calientes ni frias). */
    private boolean esBebida(Producto p) {
        Set<String> etiquetas = nombres(p);
        return !etiquetas.contains(PARA_COMER) && (etiquetas.contains("caliente") || etiquetas.contains("fria"));
    }

    private static Set<String> nombres(Producto p) {
        Set<String> s = new HashSet<>();
        for (Etiqueta e : p.getEtiquetas()) {
            s.add(e.getNombre());
        }
        return s;
    }
}
