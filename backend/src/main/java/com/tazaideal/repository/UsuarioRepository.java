package com.tazaideal.repository;

import com.tazaideal.model.NombreRol;
import com.tazaideal.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /** Trae el usuario con su rol en la misma consulta (login y filtro JWT). */
    @EntityGraph(attributePaths = "rol")
    Optional<Usuario> findByCorreoIgnoreCase(String correo);

    boolean existsByCorreoIgnoreCase(String correo);

    /**
     * Busqueda del administrador. Todos los filtros son opcionales:
     * si llegan en null no se aplican.
     */
    @EntityGraph(attributePaths = "rol")
    @Query("""
            SELECT u FROM Usuario u
            WHERE (:q IS NULL OR LOWER(u.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
                              OR LOWER(u.correo) LIKE LOWER(CONCAT('%', :q, '%')))
              AND (:rol IS NULL OR u.rol.nombre = :rol)
              AND (:activo IS NULL OR u.activo = :activo)
            """)
    Page<Usuario> buscar(@Param("q") String q,
                         @Param("rol") NombreRol rol,
                         @Param("activo") Boolean activo,
                         Pageable pageable);
}
