package com.tazaideal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/** Enlace para restablecer la contrasena. Vence a los 30 minutos y se usa una sola vez. */
@Entity
@Table(name = "tokens_recuperacion")
@Getter
@Setter
@NoArgsConstructor
public class TokenRecuperacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 100)
    private String token;

    @Column(name = "expira_en", nullable = false)
    private LocalDateTime expiraEn;

    @Column(nullable = false)
    private boolean usado = false;

    public boolean esValido(LocalDateTime ahora) {
        return !usado && ahora.isBefore(expiraEn);
    }
}
