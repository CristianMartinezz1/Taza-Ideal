package com.tazaideal.model;

/**
 * Estados de un pedido. Solo se avanza en este orden:
 * PENDIENTE -> EN_PREPARACION -> LISTO -> ENTREGADO.
 * Un pedido PENDIENTE tambien puede pasar a CANCELADO.
 */
public enum EstadoPedido {
    PENDIENTE,
    EN_PREPARACION,
    LISTO,
    ENTREGADO,
    CANCELADO;

    /** Indica si se permite pasar de este estado al estado nuevo. */
    public boolean puedeCambiarA(EstadoPedido nuevo) {
        return switch (this) {
            case PENDIENTE -> nuevo == EN_PREPARACION || nuevo == CANCELADO;
            case EN_PREPARACION -> nuevo == LISTO;
            case LISTO -> nuevo == ENTREGADO;
            case ENTREGADO, CANCELADO -> false;
        };
    }
}
