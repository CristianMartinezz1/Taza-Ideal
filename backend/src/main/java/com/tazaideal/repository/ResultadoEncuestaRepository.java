package com.tazaideal.repository;

import com.tazaideal.model.ResultadoEncuesta;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResultadoEncuestaRepository extends JpaRepository<ResultadoEncuesta, Long> {

    /** Ultimo resultado del cliente con la bebida recomendada (si hay empate de fecha, el id mas alto). */
    @EntityGraph(attributePaths = "producto")
    Optional<ResultadoEncuesta> findFirstByUsuarioIdOrderByCreadoEnDescIdDesc(Long usuarioId);
}
