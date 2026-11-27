package com.tazaideal.service;

import com.tazaideal.model.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Avisos al usuario (correo, SMS y WhatsApp).
 * Por ahora solo los escribe en el log; el issue de notificaciones
 * conecta el envio real (JavaMailSender + Twilio) sin cambiar a quien lo llama.
 */
@Service
public class NotificacionService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionService.class);

    /** Correo con el codigo de 6 digitos para verificar la cuenta. */
    public void enviarCodigoVerificacion(Usuario usuario, String codigo) {
        log.info("[CORREO] Para {}: tu código de verificación de Taza Ideal es {}", usuario.getCorreo(), codigo);
    }

    /** Correo con el enlace para restablecer la contrasena. */
    public void enviarRecuperacion(Usuario usuario, String enlace) {
        log.info("[CORREO] Para {}: restablece tu contraseña en {}", usuario.getCorreo(), enlace);
    }
}
