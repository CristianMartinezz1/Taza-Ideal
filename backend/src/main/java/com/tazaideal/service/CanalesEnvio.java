package com.tazaideal.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Envia realmente los mensajes. Cada metodo es @Async: corre en otro hilo para que
 * el usuario no espere al servidor de correo o a Twilio, y si falla solo se registra en el log.
 *
 * - Correo: JavaMailSender (en el VPS, Postfix en localhost reenvia por el SMTP del dominio).
 * - SMS y WhatsApp: API REST de Twilio.
 */
@Component
public class CanalesEnvio {

    private static final Logger log = LoggerFactory.getLogger(CanalesEnvio.class);

    private final JavaMailSender correo;
    private final RestClient twilio;
    private final boolean correoHabilitado;
    private final String remitente;
    private final boolean twilioHabilitado;
    private final String accountSid;
    private final String numeroSms;
    private final String numeroWhatsapp;
    private final String prefijoPais;

    public CanalesEnvio(JavaMailSender correo,
                        @Value("${app.mail.habilitado:false}") boolean correoHabilitado,
                        @Value("${app.mail.remitente:Taza Ideal <no-reply@tazaideal.online>}") String remitente,
                        @Value("${app.twilio.habilitado:false}") boolean twilioHabilitado,
                        @Value("${app.twilio.url:https://api.twilio.com}") String twilioUrl,
                        @Value("${app.twilio.account-sid:}") String accountSid,
                        @Value("${app.twilio.auth-token:}") String authToken,
                        @Value("${app.twilio.numero-sms:}") String numeroSms,
                        @Value("${app.twilio.numero-whatsapp:}") String numeroWhatsapp,
                        @Value("${app.twilio.prefijo-pais:+52}") String prefijoPais) {
        this.correo = correo;
        this.correoHabilitado = correoHabilitado;
        this.remitente = remitente;
        this.twilioHabilitado = twilioHabilitado;
        this.accountSid = accountSid;
        this.numeroSms = numeroSms;
        this.numeroWhatsapp = numeroWhatsapp;
        this.prefijoPais = prefijoPais;
        String credenciales = Base64.getEncoder()
                .encodeToString((accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8));
        this.twilio = RestClient.builder().baseUrl(twilioUrl)
                .defaultHeader("Authorization", "Basic " + credenciales)
                .build();
    }

    @Async
    public void correo(String para, String asunto, String html) {
        if (!correoHabilitado) {
            log.info("[CORREO desactivado] Para {}: {}", para, asunto);
            return;
        }
        try {
            MimeMessage mensaje = correo.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, false, StandardCharsets.UTF_8.name());
            helper.setFrom(remitente);
            helper.setTo(para);
            helper.setSubject(asunto);
            helper.setText(html, true);
            correo.send(mensaje);
            log.info("[CORREO] Enviado a {}: {}", para, asunto);
        } catch (Exception e) {
            log.error("[CORREO] No se pudo enviar a {}: {}", para, e.getMessage());
        }
    }

    @Async
    public void sms(String telefono, String texto) {
        enviarTwilio(numeroSms, e164(telefono), texto, "SMS");
    }

    @Async
    public void whatsapp(String telefono, String texto) {
        String destino = e164(telefono);
        enviarTwilio(numeroWhatsapp, destino == null ? null : "whatsapp:" + destino, texto, "WhatsApp");
    }

    private void enviarTwilio(String desde, String para, String texto, String canal) {
        if (para == null) {
            log.info("[{}] El cliente no tiene teléfono registrado; no se envía", canal);
            return;
        }
        if (!twilioHabilitado) {
            log.info("[{} desactivado] Para {}: {}", canal, para, texto);
            return;
        }
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("From", desde);
        form.add("To", para);
        form.add("Body", texto);
        try {
            twilio.post()
                    .uri("/2010-04-01/Accounts/{sid}/Messages.json", accountSid)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .toBodilessEntity();
            log.info("[{}] Enviado a {}", canal, para);
        } catch (Exception e) {
            log.error("[{}] No se pudo enviar a {}: {}", canal, para, e.getMessage());
        }
    }

    /** Telefono en formato internacional: 10 digitos -> +52 + digitos; si ya trae +, se respeta. */
    String e164(String telefono) {
        if (telefono == null || telefono.isBlank()) {
            return null;
        }
        String limpio = telefono.replaceAll("[\\s()-]", "");
        if (limpio.startsWith("+")) {
            return limpio;
        }
        return prefijoPais + limpio;
    }
}
