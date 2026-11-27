package com.tazaideal.repository;

import com.tazaideal.model.TokenRevocado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface TokenRevocadoRepository extends JpaRepository<TokenRevocado, Long> {

    boolean existsByJti(String jti);

    /** Limpia los tokens que ya vencieron (ya no hace falta recordarlos). */
    @Modifying
    @Query("DELETE FROM TokenRevocado t WHERE t.expiraEn < :ahora")
    int borrarVencidos(@Param("ahora") LocalDateTime ahora);
}
