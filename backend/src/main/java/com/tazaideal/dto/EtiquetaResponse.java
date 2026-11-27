package com.tazaideal.dto;

import com.tazaideal.model.Etiqueta;

public record EtiquetaResponse(Long id, String nombre) {

    public static EtiquetaResponse de(Etiqueta e) {
        return new EtiquetaResponse(e.getId(), e.getNombre());
    }
}
