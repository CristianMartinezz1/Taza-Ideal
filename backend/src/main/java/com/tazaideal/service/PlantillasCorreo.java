package com.tazaideal.service;

import org.springframework.web.util.HtmlUtils;

import java.math.BigDecimal;
import java.util.List;

/**
 * Correos HTML con la paleta del Figma (cafe #6F4E37, caramelo #D98A3D, crema #FFF8EE).
 * Todo texto que viene del usuario se escapa con HtmlUtils para evitar inyeccion de HTML.
 */
final class PlantillasCorreo {

    /** Una linea del pedido ya lista para mostrar. */
    record Linea(String producto, int cantidad, BigDecimal subtotal) {
    }

    private PlantillasCorreo() {
    }

    static String codigoVerificacion(String nombre, String codigo) {
        return marco("Confirma tu correo",
                "<p>Hola " + e(nombre) + ", gracias por registrarte en Taza Ideal.</p>"
                        + "<p>Tu código de verificación es:</p>"
                        + "<p style=\"font-size:32px;font-weight:700;letter-spacing:8px;color:#6F4E37;margin:16px 0\">"
                        + e(codigo) + "</p>"
                        + "<p style=\"color:#7a6a5d\">Vence en 15 minutos. Si no fuiste tú, ignora este correo.</p>");
    }

    static String recuperacion(String nombre, String enlace) {
        return marco("Restablece tu contraseña",
                "<p>Hola " + e(nombre) + ", recibimos una solicitud para cambiar tu contraseña.</p>"
                        + boton("Crear nueva contraseña", enlace)
                        + "<p style=\"color:#7a6a5d\">El enlace vence en 30 minutos y solo se puede usar una vez.</p>");
    }

    static String pedidoRecibido(String nombre, String codigo, List<Linea> lineas, BigDecimal total) {
        StringBuilder filas = new StringBuilder();
        for (Linea l : lineas) {
            filas.append("<tr><td style=\"padding:6px 0\">").append(l.cantidad()).append(" × ").append(e(l.producto()))
                    .append("</td><td style=\"padding:6px 0;text-align:right\">$").append(l.subtotal()).append("</td></tr>");
        }
        return marco("Recibimos tu pedido " + e(codigo),
                "<p>Hola " + e(nombre) + ", ya estamos preparando tu pedido.</p>"
                        + "<table style=\"width:100%;border-collapse:collapse;margin:12px 0\">" + filas
                        + "<tr><td style=\"padding:8px 0;border-top:1px solid #e6d5c1;font-weight:700\">Total</td>"
                        + "<td style=\"padding:8px 0;border-top:1px solid #e6d5c1;text-align:right;font-weight:700\">$"
                        + total + " MXN</td></tr></table>"
                        + "<p>Te avisaremos por correo, SMS y WhatsApp cuando esté listo para recoger.</p>");
    }

    static String pedidoListo(String nombre, String codigo) {
        return marco("¡Tu pedido " + e(codigo) + " está listo!",
                "<p>Hola " + e(nombre) + ", tu pedido ya está listo en barra.</p>"
                        + "<p style=\"font-size:18px;font-weight:700;color:#6F4E37;margin:16px 0\">"
                        + "Pasa a recogerlo, no necesitas hacer fila.</p>"
                        + "<p style=\"color:#7a6a5d\">Muestra el código <strong>" + e(codigo)
                        + "</strong> al barista. ¡Gracias por elegir Taza Ideal!</p>");
    }

    private static String marco(String titulo, String contenido) {
        return "<!doctype html><html><body style=\"margin:0;background:#FFF8EE;font-family:Arial,sans-serif;color:#2B1D14\">"
                + "<div style=\"max-width:520px;margin:24px auto;background:#ffffff;border:1px solid #e6d5c1;border-radius:6px\">"
                + "<div style=\"background:#6F4E37;color:#FFF8EE;padding:16px 24px;font-size:20px;font-weight:700\">☕ Taza Ideal</div>"
                + "<div style=\"padding:24px\"><h2 style=\"margin-top:0;color:#6F4E37\">" + titulo + "</h2>" + contenido + "</div>"
                + "<div style=\"padding:12px 24px;font-size:12px;color:#7a6a5d;border-top:1px solid #e6d5c1\">"
                + "Taza Ideal · tazaideal.online</div></div></body></html>";
    }

    private static String boton(String texto, String url) {
        return "<p style=\"margin:20px 0\"><a href=\"" + e(url) + "\" style=\"background:#D98A3D;color:#2B1D14;"
                + "padding:12px 20px;border-radius:4px;text-decoration:none;font-weight:700\">" + e(texto) + "</a></p>";
    }

    private static String e(String texto) {
        return texto == null ? "" : HtmlUtils.htmlEscape(texto);
    }
}
