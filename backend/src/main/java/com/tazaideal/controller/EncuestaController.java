package com.tazaideal.controller;

import com.tazaideal.dto.EncuestaRequest;
import com.tazaideal.dto.RecomendacionResponse;
import com.tazaideal.service.EncuestaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Encuesta de 6 preguntas (requiere sesion iniciada). */
@RestController
@RequestMapping("/api/encuesta")
public class EncuestaController {

    private final EncuestaService encuesta;

    public EncuestaController(EncuestaService encuesta) {
        this.encuesta = encuesta;
    }

    /** Recibe las respuestas y devuelve las 3 bebidas recomendadas con su % y razones. */
    @PostMapping
    public List<RecomendacionResponse> responder(@Valid @RequestBody EncuestaRequest req) {
        return encuesta.responder(req);
    }

    /** Ultima bebida recomendada al usuario (404 si nunca ha contestado). */
    @GetMapping("/ultima")
    public RecomendacionResponse ultima() {
        return encuesta.ultima();
    }
}
