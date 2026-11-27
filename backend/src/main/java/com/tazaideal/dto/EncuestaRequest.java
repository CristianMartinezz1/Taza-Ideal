package com.tazaideal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** Respuestas de las 6 preguntas de la encuesta. */
public record EncuestaRequest(
        @NotBlank(message = "Responde la pregunta 1")
        @Pattern(regexp = "^(caliente|fria)$", message = "Respuesta no válida en la pregunta 1")
        String temperatura,

        @NotBlank(message = "Responde la pregunta 2")
        @Pattern(regexp = "^(dulce|amargo|equilibrado|especiado)$", message = "Respuesta no válida en la pregunta 2")
        String sabor,

        @NotBlank(message = "Responde la pregunta 3")
        @Pattern(regexp = "^(si|no)$", message = "Respuesta no válida en la pregunta 3")
        String leche,

        @NotBlank(message = "Responde la pregunta 4")
        @Pattern(regexp = "^(suave|media|fuerte)$", message = "Respuesta no válida en la pregunta 4")
        String intensidad,

        @NotBlank(message = "Responde la pregunta 5")
        @Pattern(regexp = "^(si|no)$", message = "Respuesta no válida en la pregunta 5")
        String chocolate,

        @NotBlank(message = "Responde la pregunta 6")
        @Pattern(regexp = "^(manana|tarde|noche)$", message = "Respuesta no válida en la pregunta 6")
        String momento
) {
}
