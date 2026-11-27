package com.tazaideal.repository;

import com.tazaideal.model.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

    /** Categorias activas para el menu publico, en orden alfabetico. */
    List<Categoria> findByActivoTrueOrderByNombreAsc();

    @Query("""
            SELECT c FROM Categoria c
            WHERE (:q IS NULL OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%')))
              AND (:activo IS NULL OR c.activo = :activo)
            """)
    Page<Categoria> buscar(@Param("q") String q,
                           @Param("activo") Boolean activo,
                           Pageable pageable);
}
