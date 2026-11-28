package com.tazaideal.service;

import com.tazaideal.model.Pedido;
import com.tazaideal.model.Usuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;

/**
 * Decide que aviso mandar y con que datos. El envio real lo hace CanalesEnvio en otro hilo.
 *
 * Los datos se copian aqui (dentro de la transaccion) y el envio se programa para DESPUES
 * del commit: si la operacion falla y se revierte, no se manda ningun aviso.
 */
@Service
public class NotificacionService {

    private final CanalesEnvio canales;

    public NotificacionService(CanalesEnvio canales) {
        this.canales = canales;
    }

    /** Correo con el codigo de 6 digitos para verificar la cuenta. */
    public void enviarCodigoVerificacion(Usuario usuario, String codigo) {
        String para = usuario.getCorreo();
        String html = PlantillasCorreo.codigoVerificacion(usuario.getNombre(), codigo);
        despuesDelCommit(() -> canales.correo(para, "Tu código de verificación de Taza Ideal", html));
    }

    /** Correo con el enlace para restablecer la contrasena. */
    public void enviarRecuperacion(Usuario usuario, String enlace) {
        String para = usuario.getCorreo();
        String html = PlantillasCorreo.recuperacion(usuario.getNombre(), enlace);
        despuesDelCommit(() -> canales.correo(para, "Restablece tu contraseña de Taza Ideal", html));
    }

    /** Correo de confirmacion cuando el cliente hace un pedido. */
    public void pedidoRecibido(Pedido pedido) {
        String para = pedido.getUsuario().getCorreo();
        List<PlantillasCorreo.Linea> lineas = pedido.getDetalles().stream()
                .map(d -> new PlantillasCorreo.Linea(d.getProducto().getNombre(), d.getCantidad(), d.getSubtotal()))
                .toList();
        String html = PlantillasCorreo.pedidoRecibido(pedido.getUsuario().getNombre(), pedido.getCodigo(),
                lineas, pedido.getTotal());
        String asunto = "Recibimos tu pedido " + pedido.getCodigo();
        despuesDelCommit(() -> canales.correo(para, asunto, html));
    }

    /**
     * Correo, SMS y WhatsApp cuando el barista marca el pedido como LISTO.
     * El correo siempre se manda: asi el cliente se entera aunque fallen SMS o WhatsApp.
     */
    public void pedidoListo(Pedido pedido) {
        String correo = pedido.getUsuario().getCorreo();
        String telefono = pedido.getUsuario().getTelefono();
        String nombre = pedido.getUsuario().getNombre();
        String texto = "Taza Ideal: " + nombre.split(" ")[0]
                + ", tu pedido " + pedido.getCodigo() + " está listo. ¡Pasa a recogerlo!";
        String html = PlantillasCorreo.pedidoListo(nombre, pedido.getCodigo());
        String asunto = "Tu pedido " + pedido.getCodigo() + " está listo";
        despuesDelCommit(() -> {
            canales.correo(correo, asunto, html);
            canales.sms(telefono, texto);
            canales.whatsapp(telefono, texto);
        });
    }

    private static void despuesDelCommit(Runnable accion) {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    accion.run();
                }
            });
        } else {
            accion.run();
        }
    }
}
