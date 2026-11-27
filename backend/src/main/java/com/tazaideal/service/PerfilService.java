package com.tazaideal.service;

import com.tazaideal.dto.CambiarContrasenaRequest;
import com.tazaideal.dto.MensajeResponse;
import com.tazaideal.dto.PerfilRequest;
import com.tazaideal.dto.UsuarioResponse;
import com.tazaideal.exception.RecursoNoEncontradoException;
import com.tazaideal.exception.ReglaNegocioException;
import com.tazaideal.model.Usuario;
import com.tazaideal.repository.UsuarioRepository;
import com.tazaideal.security.UsuarioActual;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** El usuario con sesion consulta y edita su propio perfil (cualquier rol). */
@Service
public class PerfilService {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;

    public PerfilService(UsuarioRepository usuarios, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    @Transactional(readOnly = true)
    public UsuarioResponse ver() {
        return UsuarioResponse.de(actual());
    }

    /** Solo nombre y telefono. El correo y el rol no se cambian desde el perfil. */
    @Transactional
    public UsuarioResponse actualizar(PerfilRequest req) {
        Usuario u = actual();
        u.setNombre(req.nombre().trim());
        u.setTelefono(Texto.vacioANull(req.telefono()));
        return UsuarioResponse.de(u);
    }

    /** Pide la contrasena actual para evitar que alguien la cambie con una sesion olvidada abierta. */
    @Transactional
    public MensajeResponse cambiarContrasena(CambiarContrasenaRequest req) {
        Usuario u = actual();
        if (!encoder.matches(req.contrasenaActual(), u.getContrasena())) {
            throw new ReglaNegocioException("La contraseña actual no es correcta");
        }
        if (encoder.matches(req.contrasenaNueva(), u.getContrasena())) {
            throw new ReglaNegocioException("La contraseña nueva debe ser diferente a la actual");
        }
        u.setContrasena(encoder.encode(req.contrasenaNueva()));
        return new MensajeResponse("Tu contraseña se actualizó");
    }

    private Usuario actual() {
        Long id = UsuarioActual.id();
        return usuarios.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Usuario", id));
    }
}
