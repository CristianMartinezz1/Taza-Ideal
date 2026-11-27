package com.tazaideal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String correo;

    /** Hash BCrypt, nunca la contrasena en texto plano. */
    @Column(nullable = false, length = 100)
    private String contrasena;

    @Column(length = 20)
    private String telefono;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "correo_verificado", nullable = false)
    private boolean correoVerificado = false;

    /** Hash BCrypt del codigo de 6 digitos enviado por correo. */
    @Column(name = "codigo_verificacion", length = 100)
    private String codigoVerificacion;

    @Column(name = "codigo_vence_en")
    private LocalDateTime codigoVenceEn;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;
}
