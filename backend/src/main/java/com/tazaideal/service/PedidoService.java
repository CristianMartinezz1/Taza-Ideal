package com.tazaideal.service;

import com.tazaideal.dto.*;
import com.tazaideal.exception.RecursoNoEncontradoException;
import com.tazaideal.exception.ReglaNegocioException;
import com.tazaideal.model.*;
import com.tazaideal.repository.PedidoRepository;
import com.tazaideal.repository.ProductoRepository;
import com.tazaideal.repository.UsuarioRepository;
import com.tazaideal.security.UsuarioActual;
import com.tazaideal.security.UsuarioAutenticado;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Pedidos: el cliente los crea, consulta y cancela; el barista y el administrador
 * los listan y avanzan de estado (Pendiente -> En preparacion -> Listo -> Entregado).
 */
@Service
public class PedidoService {

    private final PedidoRepository pedidos;
    private final ProductoRepository productos;
    private final UsuarioRepository usuarios;
    private final NotificacionService notificaciones;

    public PedidoService(PedidoRepository pedidos, ProductoRepository productos, UsuarioRepository usuarios,
                         NotificacionService notificaciones) {
        this.pedidos = pedidos;
        this.productos = productos;
        this.usuarios = usuarios;
        this.notificaciones = notificaciones;
    }

    // ---------- cliente ----------

    /** Crea el pedido. El precio y el total los calcula el servidor con los precios actuales. */
    @PreAuthorize("hasRole('CLIENTE')")
    @Transactional
    public PedidoResponse crear(PedidoRequest req) {
        Usuario cliente = usuarios.findById(UsuarioActual.id())
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", UsuarioActual.id()));

        List<Long> ids = req.items().stream().map(ItemPedidoRequest::productoId).distinct().toList();
        Map<Long, Producto> porId = productos.findAllById(ids).stream()
                .collect(Collectors.toMap(Producto::getId, Function.identity()));

        Pedido p = new Pedido();
        p.setUsuario(cliente);
        p.setEstado(EstadoPedido.PENDIENTE);
        p.setHoraRecogida(req.horaRecogida());
        p.setNotas(Texto.vacioANull(req.notas()));
        p.setCodigo("TMP-" + UUID.randomUUID().toString().substring(0, 12)); // se reemplaza al tener id

        BigDecimal total = BigDecimal.ZERO;
        for (ItemPedidoRequest item : req.items()) {
            Producto producto = porId.get(item.productoId());
            if (producto == null) {
                throw new ReglaNegocioException("El producto " + item.productoId() + " no existe");
            }
            if (!producto.isDisponible()) {
                throw new ReglaNegocioException(producto.getNombre() + " no está disponible por ahora");
            }
            DetallePedido d = new DetallePedido();
            d.setProducto(producto);
            d.setCantidad(item.cantidad());
            d.setPrecioUnitario(producto.getPrecio());
            d.setTamano(Texto.vacioANull(item.tamano()));
            d.setLeche(Texto.vacioANull(item.leche()));
            p.agregarDetalle(d);
            total = total.add(d.getSubtotal());
        }
        p.setTotal(total);

        pedidos.saveAndFlush(p);
        p.setCodigo("TI-" + (1000 + p.getId()));
        notificaciones.pedidoRecibido(p);
        return PedidoResponse.conDetalle(p);
    }

    @PreAuthorize("hasRole('CLIENTE')")
    @Transactional(readOnly = true)
    public PaginaResponse<PedidoResponse> misPedidos(EstadoPedido estado, Pageable pageable) {
        return PaginaResponse.de(pedidos.buscarDelUsuario(UsuarioActual.id(), estado, pageable), PedidoResponse::resumen);
    }

    /** Detalle: el cliente solo ve los suyos; barista y administrador ven cualquiera. */
    @Transactional(readOnly = true)
    public PedidoResponse detalle(Long id) {
        Pedido p = buscarConDetalle(id);
        UsuarioAutenticado actual = UsuarioActual.obtener();
        if (actual.rol() == NombreRol.CLIENTE && !p.getUsuario().getId().equals(actual.id())) {
            throw new RecursoNoEncontradoException("Pedido", id); // no revela pedidos de otros clientes
        }
        return PedidoResponse.conDetalle(p);
    }

    /** El cliente solo puede cancelar su pedido mientras sigue Pendiente. */
    @PreAuthorize("hasRole('CLIENTE')")
    @Transactional
    public PedidoResponse cancelar(Long id) {
        Pedido p = buscarConDetalle(id);
        if (!p.getUsuario().getId().equals(UsuarioActual.id())) {
            throw new RecursoNoEncontradoException("Pedido", id);
        }
        if (p.getEstado() != EstadoPedido.PENDIENTE) {
            throw new ReglaNegocioException("Solo puedes cancelar un pedido pendiente. Este ya está "
                    + texto(p.getEstado()));
        }
        p.setEstado(EstadoPedido.CANCELADO);
        return PedidoResponse.conDetalle(p);
    }

    // ---------- barista y administrador ----------

    /** Listado con filtros: estado, texto (codigo o cliente) y rango de fechas [desde, hasta]. */
    @PreAuthorize("hasAnyRole('BARISTA','ADMIN')")
    @Transactional(readOnly = true)
    public PaginaResponse<PedidoResponse> buscar(EstadoPedido estado, String q, LocalDate desde, LocalDate hasta,
                                                 Pageable pageable) {
        LocalDateTime inicio = desde == null ? null : desde.atStartOfDay();
        LocalDateTime fin = hasta == null ? null : hasta.plusDays(1).atStartOfDay();
        return PaginaResponse.de(pedidos.buscar(estado, Texto.limpio(q), inicio, fin, pageable), PedidoResponse::resumen);
    }

    /** Avanza el estado respetando el orden. Al marcar LISTO se avisa al cliente. */
    @PreAuthorize("hasAnyRole('BARISTA','ADMIN')")
    @Transactional
    public PedidoResponse cambiarEstado(Long id, EstadoPedido nuevo) {
        Pedido p = buscarConDetalle(id);
        if (!p.getEstado().puedeCambiarA(nuevo)) {
            throw new ReglaNegocioException("No se puede pasar de " + texto(p.getEstado()) + " a " + texto(nuevo));
        }
        p.setEstado(nuevo);
        if (nuevo == EstadoPedido.LISTO) {
            notificaciones.pedidoListo(p);
        }
        return PedidoResponse.conDetalle(p);
    }

    // ---------- apoyo ----------

    private Pedido buscarConDetalle(Long id) {
        return pedidos.findConDetalleById(id).orElseThrow(() -> new RecursoNoEncontradoException("Pedido", id));
    }

    private static final Map<EstadoPedido, String> TEXTO = new HashMap<>(Map.of(
            EstadoPedido.PENDIENTE, "pendiente",
            EstadoPedido.EN_PREPARACION, "en preparación",
            EstadoPedido.LISTO, "listo",
            EstadoPedido.ENTREGADO, "entregado",
            EstadoPedido.CANCELADO, "cancelado"));

    private static String texto(EstadoPedido e) {
        return TEXTO.get(e);
    }
}
