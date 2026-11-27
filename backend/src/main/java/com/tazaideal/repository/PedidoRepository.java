package com.tazaideal.repository;

import com.tazaideal.model.EstadoPedido;
import com.tazaideal.model.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    /** Pedido completo: cliente, lineas y producto de cada linea en una sola consulta. */
    @EntityGraph(attributePaths = {"usuario", "detalles", "detalles.producto"})
    Optional<Pedido> findConDetalleById(Long id);

    /** "Mis pedidos" del cliente, del mas reciente al mas antiguo. */
    @EntityGraph(attributePaths = "usuario")
    @Query("""
            SELECT p FROM Pedido p
            WHERE p.usuario.id = :usuarioId
              AND (:estado IS NULL OR p.estado = :estado)
            """)
    Page<Pedido> buscarDelUsuario(@Param("usuarioId") Long usuarioId,
                                  @Param("estado") EstadoPedido estado,
                                  Pageable pageable);

    /**
     * Listado para barista y administrador. Filtros opcionales:
     * estado, texto (codigo o nombre del cliente) y rango de fechas.
     */
    @EntityGraph(attributePaths = "usuario")
    @Query("""
            SELECT p FROM Pedido p
            WHERE (:estado IS NULL OR p.estado = :estado)
              AND (:q IS NULL OR LOWER(p.codigo) LIKE LOWER(CONCAT('%', :q, '%'))
                              OR LOWER(p.usuario.nombre) LIKE LOWER(CONCAT('%', :q, '%')))
              AND (:desde IS NULL OR p.creadoEn >= :desde)
              AND (:hasta IS NULL OR p.creadoEn < :hasta)
            """)
    Page<Pedido> buscar(@Param("estado") EstadoPedido estado,
                        @Param("q") String q,
                        @Param("desde") LocalDateTime desde,
                        @Param("hasta") LocalDateTime hasta,
                        Pageable pageable);

    boolean existsByUsuarioId(Long usuarioId);

    /** Numero mas alto usado en los codigos TI-xxxx, para generar el siguiente. */
    @Query("SELECT COALESCE(MAX(p.id), 0) FROM Pedido p")
    long maxId();
}
