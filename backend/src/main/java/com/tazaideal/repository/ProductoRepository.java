package com.tazaideal.repository;

import com.tazaideal.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

    boolean existsByCategoriaId(Long categoriaId);

    /** Producto con su categoria y sus etiquetas en una sola consulta. */
    @EntityGraph(attributePaths = {"categoria", "etiquetas"})
    Optional<Producto> findConDetalleById(Long id);

    /**
     * Menu y listado del administrador con filtros opcionales y paginacion.
     * La categoria llega con JOIN (EntityGraph); las etiquetas se cargan por lotes (@BatchSize).
     */
    @EntityGraph(attributePaths = "categoria")
    @Query("""
            SELECT p FROM Producto p
            WHERE (:q IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
                              OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :q, '%')))
              AND (:categoriaId IS NULL OR p.categoria.id = :categoriaId)
              AND (:disponible IS NULL OR p.disponible = :disponible)
            """)
    Page<Producto> buscar(@Param("q") String q,
                          @Param("categoriaId") Long categoriaId,
                          @Param("disponible") Boolean disponible,
                          Pageable pageable);

    /** Productos disponibles con sus etiquetas, para calcular la recomendacion de la encuesta. */
    @EntityGraph(attributePaths = {"categoria", "etiquetas"})
    @Query("SELECT DISTINCT p FROM Producto p WHERE p.disponible = true")
    List<Producto> findDisponiblesConEtiquetas();
}
