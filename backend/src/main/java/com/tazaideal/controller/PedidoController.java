package com.tazaideal.controller;

import com.tazaideal.dto.PaginaResponse;
import com.tazaideal.dto.PedidoRequest;
import com.tazaideal.dto.PedidoResponse;
import com.tazaideal.model.EstadoPedido;
import com.tazaideal.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Pedidos del cliente: crear, ver los suyos y cancelar. */
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidos;

    public PedidoController(PedidoService pedidos) {
        this.pedidos = pedidos;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse crear(@Valid @RequestBody PedidoRequest req) {
        return pedidos.crear(req);
    }

    @GetMapping("/mios")
    public PaginaResponse<PedidoResponse> mios(
            @RequestParam(required = false) EstadoPedido estado,
            @PageableDefault(size = 10, sort = "creadoEn", direction = Sort.Direction.DESC) Pageable pageable) {
        return pedidos.misPedidos(estado, pageable);
    }

    @GetMapping("/{id}")
    public PedidoResponse detalle(@PathVariable Long id) {
        return pedidos.detalle(id);
    }

    @PatchMapping("/{id}/cancelar")
    public PedidoResponse cancelar(@PathVariable Long id) {
        return pedidos.cancelar(id);
    }
}
