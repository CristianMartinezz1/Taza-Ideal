package com.tazaideal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/** Token JWT invalidado al cerrar sesion (se identifica por su jti). */
@Entity
@Table(name = "tokens_revocados")
@Getter
@Setter
@NoArgsConstructor
public class TokenRevocado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String jti;

    @Column(name = "expira_en", nullable = false)
    private LocalDateTime expiraEn;

    public TokenRevocado(String jti, LocalDateTime expiraEn) {
        this.jti = jti;
        this.expiraEn = expiraEn;
    }
}
