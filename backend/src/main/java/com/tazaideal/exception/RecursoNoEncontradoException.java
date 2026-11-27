package com.tazaideal.exception;

/** Se lanza cuando no existe lo que se busca (responde 404). */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }

    /** Ejemplo: new RecursoNoEncontradoException("Producto", 7) -> "Producto 7 no encontrado". */
    public RecursoNoEncontradoException(String recurso, Object id) {
        super(recurso + " " + id + " no encontrado");
    }
}
