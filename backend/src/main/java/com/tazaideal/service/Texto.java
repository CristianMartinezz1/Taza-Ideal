package com.tazaideal.service;

/** Utilidades pequenas para limpiar texto que llega de los formularios. */
final class Texto {

    private Texto() {
    }

    /** null o espacios -> null; si no, el texto sin espacios al inicio y al final. */
    static String vacioANull(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }

    /** Para filtros de busqueda: igual que vacioANull. */
    static String limpio(String q) {
        return vacioANull(q);
    }
}
