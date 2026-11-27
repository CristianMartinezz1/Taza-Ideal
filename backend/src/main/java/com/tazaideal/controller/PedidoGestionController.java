package com.tazaideal.controller;

import com.tazaideal.dto.CambiarEstadoRequest;
import com.tazaideal.dto.PaginaResponse;
import com.tazaideal.dto.PedidoResponse;
import com.tazaideal.model.EstadoPedido;
import com.tazaideal.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * Pedidos para el barista (/api/barista/pedidos) y el administrador (/api/admin/pedidos).
 * Ejemplos:
 *   GET /api/barista/pedidos?estado=PENDIENTE&fecha=2026-11-27
 *   GET /api/admin/pedidos?q=TI-1003&desde=2026-11-01&hasta=2026-11-30
 *   PATCH /api/barista/pedidos/5/estado  {"estado":"LISTO"}
 */
@RestController
public class PedidoGestionController {

    private final PedidoService pedidos;

    public PedidoGestionController(PedidoService pedidos) {
        this.pedidos = pedidos;
    }

    // ---------- barista ----------

    @GetMapping("/api/barista/pedidos")
    public PaginaResponse<PedidoResponse> cola(
            @RequestParam(required = false) EstadoPedido estado,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @PageableDefault(size = 20, sort = "creadoEn", direction = Sort.Direction.ASC) Pageable pageable) {
        return pedidos.buscar(estado, q, fecha, fecha, pageable);
    }

    @GetMapping("/api/barista/pedidos/{id}")
    public PedidoResponse detalleBarista(@PathVariable Long id) {
        return pedidos.detalle(id);
    }

    @PatchMapping("/api/barista/pedidos/{id}/estado")
    public PedidoResponse estadoBarista(@PathVariable Long id, @Valid @RequestBody CambiarEstadoRequest req) {
        return pedidos.cambiarEstado(id, req.estado());
    }

    // ---------- administrador ----------

    @GetMapping("/api/admin/pedidos")
    public PaginaResponse<PedidoResponse> todos(
            @RequestParam(required = false) EstadoPedido estado,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @PageableDefault(size = 10, sort = "creadoEn", direction = Sort.Direction.DESC) Pageable pageable) {
        return pedidos.buscar(estado, q, desde, hasta, pageable);
    }

    @GetMapping("/api/admin/pedidos/{id}")
    public PedidoResponse detalleAdmin(@PathVariable Long id) {
        return pedidos.detalle(id);
    }

    @PatchMapping("/api/admin/pedidos/{id}/estado")
    public PedidoResponse estadoAdmin(@PathVariable Long id, @Valid @RequestBody CambiarEstadoRequest req) {
        return pedidos.cambiarEstado(id, req.estado());
    }
}
