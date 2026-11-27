package com.tazaideal.service;

import com.tazaideal.dto.PaginaResponse;
import com.tazaideal.dto.UsuarioRequest;
import com.tazaideal.dto.UsuarioResponse;
import com.tazaideal.exception.RecursoNoEncontradoException;
import com.tazaideal.exception.ReglaNegocioException;
import com.tazaideal.model.NombreRol;
import com.tazaideal.model.Usuario;
import com.tazaideal.repository.PedidoRepository;
import com.tazaideal.repository.RolRepository;
import com.tazaideal.repository.UsuarioRepository;
import com.tazaideal.security.UsuarioActual;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Gestion de usuarios por el administrador. */
@Service
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioService {

    private final UsuarioRepository usuarios;
    private final RolRepository roles;
    private final PedidoRepository pedidos;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository usuarios, RolRepository roles, PedidoRepository pedidos,
                          PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.roles = roles;
        this.pedidos = pedidos;
        this.encoder = encoder;
    }

    @Transactional(readOnly = true)
    public PaginaResponse<UsuarioResponse> buscar(String q, NombreRol rol, Boolean activo, Pageable pageable) {
        return PaginaResponse.de(usuarios.buscar(Texto.limpio(q), rol, activo, pageable), UsuarioResponse::de);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtener(Long id) {
        return UsuarioResponse.de(buscarPorId(id));
    }

    /** Alta por el administrador: la contrasena es obligatoria y el correo se da por verificado. */
    @Transactional
    public UsuarioResponse crear(UsuarioRequest req) {
        if (req.contrasena() == null || req.contrasena().isBlank()) {
            throw new ReglaNegocioException("La contraseña es obligatoria para un usuario nuevo");
        }
        String correo = req.correo().trim().toLowerCase();
        if (usuarios.existsByCorreoIgnoreCase(correo)) {
            throw new ReglaNegocioException("El correo ya está registrado");
        }
        Usuario u = new Usuario();
        u.setCorreo(correo);
        u.setContrasena(encoder.encode(req.contrasena()));
        u.setCorreoVerificado(true);
        aplicar(u, req);
        return UsuarioResponse.de(usuarios.save(u));
    }

    /** Edicion. Si la contrasena viene vacia se conserva la actual. */
    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioRequest req) {
        Usuario u = buscarPorId(id);
        String correo = req.correo().trim().toLowerCase();
        if (!correo.equalsIgnoreCase(u.getCorreo()) && usuarios.existsByCorreoIgnoreCase(correo)) {
            throw new ReglaNegocioException("El correo ya está registrado");
        }
        if (esElMismo(id)) {
            if (req.rol() != NombreRol.ADMIN) {
                throw new ReglaNegocioException("No puedes quitarte el rol de administrador");
            }
            if (Boolean.FALSE.equals(req.activo())) {
                throw new ReglaNegocioException("No puedes desactivar tu propia cuenta");
            }
        }
        u.setCorreo(correo);
        if (req.contrasena() != null && !req.contrasena().isBlank()) {
            u.setContrasena(encoder.encode(req.contrasena()));
        }
        aplicar(u, req);
        return UsuarioResponse.de(u);
    }

    /**
     * El administrador no puede eliminarse a si mismo.
     * Un usuario con pedidos no se elimina (se perderia el historial): se desactiva.
     */
    @Transactional
    public void eliminar(Long id) {
        Usuario u = buscarPorId(id);
        if (esElMismo(id)) {
            throw new ReglaNegocioException("No puedes eliminar tu propia cuenta");
        }
        if (pedidos.existsByUsuarioId(id)) {
            throw new ReglaNegocioException("El usuario tiene pedidos registrados. Desactívalo en lugar de eliminarlo");
        }
        usuarios.delete(u);
    }

    private void aplicar(Usuario u, UsuarioRequest req) {
        u.setNombre(req.nombre().trim());
        u.setTelefono(Texto.vacioANull(req.telefono()));
        u.setRol(roles.findByNombre(req.rol())
                .orElseThrow(() -> new IllegalStateException("Falta el rol " + req.rol() + " en la base de datos")));
        if (req.activo() != null) {
            u.setActivo(req.activo());
        }
    }

    private boolean esElMismo(Long id) {
        return id.equals(UsuarioActual.id());
    }

    private Usuario buscarPorId(Long id) {
        return usuarios.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Usuario", id));
    }
}
