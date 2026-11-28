import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Tabla from "../../componentes/Tabla";
import ChipEstado from "../../componentes/ChipEstado";
import Campo from "../../componentes/Campo";
import Boton from "../../componentes/Boton";
import Modal from "../../componentes/Modal";
import Cargando from "../../componentes/Cargando";
import MensajeError from "../../componentes/MensajeError";
import "./admin.css";

const VACIO = { id: null, nombre: "", correo: "", telefono: "", contrasena: "", rol: "CLIENTE", activo: true };

export default function AdminUsuarios() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [q, setQ] = useState("");
  const [rolFiltro, setRolFiltro] = useState("");
  const [activoFiltro, setActivoFiltro] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});
  const [aEliminar, setAEliminar] = useState(null);
  const cargar = async (pag = 0) => {
    setCargando(true);
    setError("");
    try {
      const params = { page: pag, size: 6 };
      if (q.trim()) params.q = q.trim();
      if (rolFiltro) params.rol = rolFiltro;
      if (activoFiltro !== "") params.activo = activoFiltro;
      const { data } = await cliente.get("/admin/usuarios", { params });
      setLista(data.contenido || []);
      setPagina(data.pagina ?? pag);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      setError(err.mensaje || "No se pudieron cargar los usuarios.");
    } finally {
      setCargando(false);}};

  useEffect(() => {
    const t = setTimeout(() => cargar(0), 250);
    return () => clearTimeout(t);
  }, [q, rolFiltro, activoFiltro]);

  const guardar = async (e) => {
    e.preventDefault();
    setErrores({});
    try {
      const body = { ...form, nombre: form.nombre.trim(), correo: form.correo.trim(), contrasena: form.contrasena || null, telefono: form.telefono?.trim() || null };
      form.id ? await cliente.put(`/admin/usuarios/${form.id}`, body) : await cliente.post("/admin/usuarios", body);
      setMsg(form.id ? "Usuario actualizado." : "Usuario creado.");
      setForm(null);
      cargar(pagina);
    } catch (err) {
      setErrores(err.errores || { general: err.mensaje });}};

  const eliminar = async () => {
    try {
      await cliente.delete(`/admin/usuarios/${aEliminar.id}`);
      setMsg(`Usuario ${aEliminar.nombre} eliminado.`);
      cargar(pagina);
    } catch (err) {
      setError(err.mensaje || "No se pudo eliminar el usuario.");
    } finally {
      setAEliminar(null);
    }
  };

  const pass = form?.contrasena || "";
  return(
       <div className="admin-pagina">
      <Navbar usuario={usuario} alCerrarSesion={async () => { await logout(); navigate("/login"); }} />
      <main className="admin-contenedor">
     {form ? (
           <div>
            <h1 className="admin-titulo" style={{ textAlign: "center", marginBottom: "1rem" }}>{form.id ? "Editar usuario" : "Nuevo usuario"}</h1>
            <form className="admin-form-caja" onSubmit={guardar} noValidate>
              {errores.general && <p className="campo-mensaje-error" style={{ marginBottom: "0.75rem" }}>{errores.general}</p>}
              <Campo etiqueta="Nombre completo" nombre="nombre" placeholder="Pedro Gómez" valor={form.nombre} error={errores.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              <Campo etiqueta="Correo electrónico" tipo="email" nombre="correo" placeholder="pedro.gomez@correo.com" valor={form.correo} error={errores.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
              <Campo etiqueta="Teléfono" tipo="tel" nombre="telefono" placeholder="+52 951 555 0123" valor={form.telefono || ""} error={errores.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              <Campo etiqueta={form.id ? "Nueva contraseña (opcional)" : "Contraseña"} tipo="password" nombre="contrasena" placeholder="Taza#2026" valor={pass} error={errores.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} />

              {(!form.id || pass) && (
                <div style={{ fontSize: "0.75rem", margin: "-0.3rem 0 0.85rem", lineHeight: 1.6 }}>
                  <div style={{ color: pass.length >= 8 ? "var(--verde)" : "var(--rojo)" }}>● Mínimo 8 caracteres</div>
                  <div style={{ color: /[A-Z]/.test(pass) ? "var(--verde)" : "var(--rojo)" }}>● Al menos una mayúscula</div>
                  <div style={{ color: /[0-9]/.test(pass) ? "var(--verde)" : "var(--rojo)" }}>● Al menos un número</div>
                  <div style={{ color: /[^A-Za-z0-9]/.test(pass) ? "var(--verde)" : "var(--rojo)" }}>● Al menos un carácter especial</div>
                </div> )}

                <div className="campo-grupo">
                <label className="campo-etiqueta">Rol</label>
                <select className="campo-input" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                   <option value="CLIENTE">Cliente</option>
                  <option value="BARISTA">Barista</option>
                    <option value="ADMIN">Administrador</option>
                </select>
                </div>

                 {form.id && (
                <label style={{ display: "flex", gap: "0.5rem", fontSize: "0.82rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
                  <span>Usuario activo</span>
                </label>)}

              <div className="admin-form-pie">
                <Boton variante="secundario" onClick={() => setForm(null)}>Cancelar</Boton>
                <Boton tipo="submit" variante="primario">Guardar usuario</Boton>
              </div>
            </form>
              </div>
           ) : (
          <>
            <div className="admin-encabezado">
              <h1 className="admin-titulo">Usuarios</h1>
              <Boton variante="primario" onClick={() => { setForm(VACIO); setErrores({}); }}>Nuevo usuario</Boton>
              </div>
              <div className="admin-filtros">
              <input type="text" className="admin-input" placeholder="Buscar por nombre o correo..." value={q} onChange={(e) => setQ(e.target.value)} />
              <select className="admin-select" value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)}>
                <option value="">Rol: Todos</option>
                <option value="ADMIN">Administrador</option>
                <option value="BARISTA">Barista</option>
                <option value="CLIENTE">Cliente</option>
              </select>
              <select className="admin-select" value={activoFiltro} onChange={(e) => setActivoFiltro(e.target.value)}>
                <option value="">Estado: Todos</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

            {msg && <div className="admin-aviso">{msg}</div>}
            {cargando ? <Cargando texto="Cargando usuarios..." /> : error ? <MensajeError detalle={error} alReintentar={() => cargar(pagina)} /> : (
              <Tabla
                columnas={[{ titulo: "Nombre" }, { titulo: "Correo" }, { titulo: "Rol" }, { titulo: "Teléfono" }, { titulo: "Estado" }, { titulo: "Acciones" }]}
                datos={lista}
                paginaActual={pagina}
                totalPaginas={totalPaginas}
                alCambiarPagina={cargar}
                mensajeVacio="No hay usuarios con esos filtros."
                renderFila={(u) => (
                  <tr key={u.id}>
                    <td><strong>{u.nombre}</strong></td>
                    <td>{u.correo}</td>
                    <td><ChipEstado estado={u.rol === "ADMIN" ? "Administrador" : u.rol === "BARISTA" ? "Barista" : "Cliente"} /></td>
                    <td>{u.telefono || "—"}</td>
                    <td><ChipEstado estado={u.activo ? "Activo" : "Inactivo"} /></td>
                    <td>
                      <div className="admin-acciones">
                        <button type="button" className="admin-link-editar" onClick={() => { setForm({ ...u, contrasena: "" }); setErrores({}); }}>Editar</button>
                        <button type="button" className="admin-link-eliminar" onClick={() => setAEliminar(u)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                )}
              />)}
          </>)}
        <Modal
          abierto={Boolean(aEliminar)}
          titulo={`¿Eliminar a ${aEliminar?.nombre || ""}?`}
          mensaje="Se borrará su cuenta y ya no podrá iniciar sesión. Esta acción no se puede deshacer."
          textoConfirmar="Sí, eliminar"
          textoCancelar="Cancelar"
          varianteConfirmar="peligro"
          alConfirmar={eliminar}
          alCancelar={() => setAEliminar(null)}/>
      </main>
    </div>  );}