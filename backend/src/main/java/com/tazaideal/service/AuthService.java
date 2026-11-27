package com.tazaideal.service;

import com.tazaideal.dto.*;
import com.tazaideal.exception.RecursoNoEncontradoException;
import com.tazaideal.exception.ReglaNegocioException;
import com.tazaideal.model.NombreRol;
import com.tazaideal.model.TokenRecuperacion;
import com.tazaideal.model.TokenRevocado;
import com.tazaideal.model.Usuario;
import com.tazaideal.repository.RolRepository;
import com.tazaideal.repository.TokenRecuperacionRepository;
import com.tazaideal.repository.TokenRevocadoRepository;
import com.tazaideal.repository.UsuarioRepository;
import com.tazaideal.security.JwtService;
import com.tazaideal.security.UsuarioActual;
import com.tazaideal.security.UsuarioAutenticado;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;

/**
 * Registro, verificacion de correo, login, logout y recuperacion de contrasena.
 */
@Service
public class AuthService {

    static final int MINUTOS_CODIGO = 15;
    static final int MINUTOS_RECUPERACION = 30;
    private static final String MENSAJE_RECUPERAR =
            "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña";

    private final UsuarioRepository usuarios;
    private final RolRepository roles;
    private final TokenRevocadoRepository revocados;
    private final TokenRecuperacionRepository recuperaciones;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final NotificacionService notificaciones;
    private final String urlFrontend;
    private final SecureRandom aleatorio = new SecureRandom();

    public AuthService(UsuarioRepository usuarios, RolRepository roles, TokenRevocadoRepository revocados,
                       TokenRecuperacionRepository recuperaciones, PasswordEncoder encoder, JwtService jwt,
                       NotificacionService notificaciones,
                       @Value("${app.frontend.url:http://localhost:5173}") String urlFrontend) {
        this.usuarios = usuarios;
        this.roles = roles;
        this.revocados = revocados;
        this.recuperaciones = recuperaciones;
        this.encoder = encoder;
        this.jwt = jwt;
        this.notificaciones = notificaciones;
        this.urlFrontend = urlFrontend;
    }

    /** Crea una cuenta de CLIENTE, envia el codigo de verificacion y devuelve la sesion iniciada. */
    @Transactional
    public AuthResponse registrar(RegistroRequest req) {
        String correo = normalizar(req.correo());
        if (usuarios.existsByCorreoIgnoreCase(correo)) {
            throw new ReglaNegocioException("El correo ya está registrado");
        }
        Usuario u = new Usuario();
        u.setNombre(req.nombre().trim());
        u.setCorreo(correo);
        u.setContrasena(encoder.encode(req.contrasena()));
        u.setTelefono(vacioANull(req.telefono()));
        u.setRol(roles.findByNombre(NombreRol.CLIENTE)
                .orElseThrow(() -> new IllegalStateException("Falta el rol CLIENTE en la base de datos")));
        u.setActivo(true);
        u.setCorreoVerificado(false);
        String codigo = nuevoCodigo(u);
        usuarios.save(u);
        notificaciones.enviarCodigoVerificacion(u, codigo);
        return sesion(u);
    }

    /** Valida correo y contrasena. Mismo mensaje si falla cualquiera de los dos (no revela si el correo existe). */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        Usuario u = usuarios.findByCorreoIgnoreCase(normalizar(req.correo()))
                .filter(x -> encoder.matches(req.contrasena(), x.getContrasena()))
                .orElseThrow(() -> new BadCredentialsException("Credenciales incorrectas"));
        if (!u.isActivo()) {
            throw new DisabledException("Cuenta desactivada");
        }
        return sesion(u);
    }

    /** Datos del usuario con sesion iniciada. */
    @Transactional(readOnly = true)
    public UsuarioResponse yo() {
        return UsuarioResponse.de(usuarioActual());
    }

    /** Confirma el correo con el codigo de 6 digitos. */
    @Transactional
    public UsuarioResponse verificarCorreo(VerificarCorreoRequest req) {
        Usuario u = usuarioActual();
        if (u.isCorreoVerificado()) {
            throw new ReglaNegocioException("Tu correo ya está verificado");
        }
        if (u.getCodigoVerificacion() == null || u.getCodigoVenceEn() == null
                || LocalDateTime.now().isAfter(u.getCodigoVenceEn())) {
            throw new ReglaNegocioException("El código venció. Pide uno nuevo");
        }
        if (!encoder.matches(req.codigo(), u.getCodigoVerificacion())) {
            throw new ReglaNegocioException("El código no es correcto");
        }
        u.setCorreoVerificado(true);
        u.setCodigoVerificacion(null);
        u.setCodigoVenceEn(null);
        return UsuarioResponse.de(u);
    }

    /** Genera y envia un codigo nuevo (el anterior deja de servir). */
    @Transactional
    public MensajeResponse reenviarCodigo() {
        Usuario u = usuarioActual();
        if (u.isCorreoVerificado()) {
            throw new ReglaNegocioException("Tu correo ya está verificado");
        }
        String codigo = nuevoCodigo(u);
        notificaciones.enviarCodigoVerificacion(u, codigo);
        return new MensajeResponse("Te enviamos un código nuevo a " + u.getCorreo());
    }

    /** Cierra la sesion: el token actual queda revocado hasta que venza. */
    @Transactional
    public MensajeResponse logout() {
        UsuarioAutenticado actual = UsuarioActual.obtener();
        if (!revocados.existsByJti(actual.jti())) {
            revocados.save(new TokenRevocado(actual.jti(),
                    LocalDateTime.ofInstant(actual.expiraEn(), ZoneId.systemDefault())));
        }
        return new MensajeResponse("Sesión cerrada");
    }

    /**
     * Envia un enlace para restablecer la contrasena (vence en 30 minutos).
     * Siempre responde lo mismo, exista o no el correo, para no revelar que cuentas existen.
     */
    @Transactional
    public MensajeResponse recuperar(RecuperarRequest req) {
        usuarios.findByCorreoIgnoreCase(normalizar(req.correo()))
                .filter(Usuario::isActivo)
                .ifPresent(u -> {
                    TokenRecuperacion t = new TokenRecuperacion();
                    t.setUsuario(u);
                    t.setToken(tokenAleatorio());
                    t.setExpiraEn(LocalDateTime.now().plusMinutes(MINUTOS_RECUPERACION));
                    recuperaciones.save(t);
                    notificaciones.enviarRecuperacion(u, urlFrontend + "/restablecer?token=" + t.getToken());
                });
        return new MensajeResponse(MENSAJE_RECUPERAR);
    }

    /** Cambia la contrasena usando el token del enlace. El token sirve una sola vez. */
    @Transactional
    public MensajeResponse restablecer(RestablecerRequest req) {
        TokenRecuperacion t = recuperaciones.findByToken(req.token())
                .filter(x -> x.esValido(LocalDateTime.now()))
                .orElseThrow(() -> new ReglaNegocioException("El enlace no es válido o ya venció. Solicita uno nuevo"));
        Usuario u = t.getUsuario();
        u.setContrasena(encoder.encode(req.contrasenaNueva()));
        t.setUsado(true);
        return new MensajeResponse("Tu contraseña se cambió. Ya puedes iniciar sesión");
    }

    // ---------- apoyo ----------

    private AuthResponse sesion(Usuario u) {
        JwtService.TokenGenerado t = jwt.generar(u);
        return AuthResponse.bearer(t.token(), t.expiraEn(), UsuarioResponse.de(u));
    }

    private Usuario usuarioActual() {
        Long id = UsuarioActual.id();
        return usuarios.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Usuario", id));
    }

    /** Guarda el hash del codigo (nunca el codigo en texto) y devuelve el codigo para enviarlo. */
    private String nuevoCodigo(Usuario u) {
        String codigo = String.format("%06d", aleatorio.nextInt(1_000_000));
        u.setCodigoVerificacion(encoder.encode(codigo));
        u.setCodigoVenceEn(LocalDateTime.now().plusMinutes(MINUTOS_CODIGO));
        return codigo;
    }

    private String tokenAleatorio() {
        byte[] bytes = new byte[32];
        aleatorio.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String normalizar(String correo) {
        return correo.trim().toLowerCase();
    }

    private static String vacioANull(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }
}
