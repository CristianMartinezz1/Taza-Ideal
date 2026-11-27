package com.tazaideal.exception;

/**
 * Los datos tienen formato correcto pero rompen una regla del negocio (responde 422).
 * Ejemplos: correo ya registrado, cancelar un pedido que ya se esta preparando,
 * el administrador intenta eliminarse a si mismo.
 */
public class ReglaNegocioException extends RuntimeException {

    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
