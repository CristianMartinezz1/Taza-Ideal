import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import cliente from "../../api/cliente";
import { AuthContext } from "../../context/AuthContext";
import Campo from "../../componentes/Campo";
import Boton from "../../componentes/Boton";
import MensajeError from "../../componentes/MensajeError";
import Logo from "../../componentes/Logo";
import "./acceso.css";

export default function Registro() {
  const { login } = useContext(AuthContext);
  const navegar = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: "",
    aceptaTerminos: false,
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando] = useState(false);

  const reglas = [
    ["Mínimo 8 caracteres", form.contrasena.length >= 8],
    ["Al menos una mayúscula", /[A-Z]/.test(form.contrasena)],
    ["Al menos un número", /[0-9]/.test(form.contrasena)],
    ["Al menos un carácter especial (!@#$%)", /[^A-Za-z0-9]/.test(form.contrasena)],
  ];

  const cambiar = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
    if (errores[campo]) setErrores({ ...errores, [campo]: "" });
  };

  function validar() {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Escribe tu nombre completo";
    if (!form.correo.includes("@")) e.correo = "Escribe un correo válido, por ejemplo ana@correo.com";
    if (form.telefono.replace(/\D/g, "").length < 10) e.telefono = "Escribe un teléfono válido de 10 dígitos";
    if (reglas.some(([, ok]) => !ok)) e.contrasena = "La contraseña no cumple los requisitos";
    if (!form.confirmarContrasena || form.confirmarContrasena !== form.contrasena) e.confirmarContrasena = "Las contraseñas no coinciden";
    if (!form.aceptaTerminos) e.aceptaTerminos = "Debes aceptar los Términos y la Política de privacidad";
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  async function enviarFormulario(e) {
    e.preventDefault();
    setErrorGeneral("");
    if (!validar()) return;

    setCargando(true);
    try {
      const { data } = await cliente.post("/auth/registro", {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        contrasena: form.contrasena,
        aceptaTerminos: form.aceptaTerminos,
      });
      login(data.usuario, data.token);
      navegar("/verificar-correo");
    } catch (err) {
      if (err.errores && Object.keys(err.errores).length > 0) setErrores(err.errores);
      else setErrorGeneral(err.mensaje || "No se pudo crear la cuenta");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="acceso-contenedor">
      <aside className="acceso-marca">
        <div className="acceso-marca-caja">
          <div className="acceso-logo-circulo"><Logo tamano={105} /></div>
          <h1>Taza ideal</h1>
          <p className="acceso-subtitulo">El café que te entiende</p>
          <p className="acceso-descripcion">
            Responde 6 preguntas y te recomendamos la bebida de nuestro menú que
            mejor va con tu gusto. Pídela en línea y recógela sin filas.
          </p>
        </div>
      </aside>

      <main className="acceso-lado-form" style={{ backgroundImage: "none", backgroundColor: "var(--crema)" }}>
        <div className="acceso-tarjeta">
          <h2>Crear cuenta</h2>
          {errorGeneral && <MensajeError detalle={errorGeneral} />}

          <form onSubmit={enviarFormulario} noValidate>
            <Campo etiqueta="Nombre completo" nombre="nombre" valor={form.nombre} placeholder="Ana López" error={errores.nombre} onChange={(e) => cambiar("nombre", e.target.value)} />
            <Campo etiqueta="Correo electrónico" tipo="email" nombre="correo" valor={form.correo} placeholder="ana.lopez@correo.com" error={errores.correo} onChange={(e) => cambiar("correo", e.target.value)} />
            <Campo etiqueta="Teléfono (para SMS y WhatsApp)" tipo="tel" nombre="telefono" valor={form.telefono} placeholder="+52 951 123 4567" ayuda="Te avisaremos cuando tu pedido esté listo" error={errores.telefono} onChange={(e) => cambiar("telefono", e.target.value)} />
            <Campo etiqueta="Contraseña" tipo="password" nombre="contrasena" valor={form.contrasena} placeholder="••••••••" error={errores.contrasena} onChange={(e) => cambiar("contrasena", e.target.value)} />

            <div style={{ fontSize: "0.75rem", margin: "-0.3rem 0 0.85rem", lineHeight: 1.6 }}>
              {reglas.map(([texto, ok]) => (
                <div key={texto} style={{ color: ok ? "var(--verde)" : "var(--rojo)" }}>● {texto}</div>
              ))}
            </div>

            <Campo etiqueta="Confirmar contraseña" tipo="password" nombre="confirmarContrasena" valor={form.confirmarContrasena} placeholder="••••••••" error={errores.confirmarContrasena} onChange={(e) => cambiar("confirmarContrasena", e.target.value)} />

            <div style={{ marginBottom: "0.9rem" }}>
              <label style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", cursor: "pointer" }}>
                <input type="checkbox" checked={form.aceptaTerminos} onChange={(e) => cambiar("aceptaTerminos", e.target.checked)} />
                <span>Acepto los <Link to="/terminos" className="acceso-link">Términos y la Política de privacidad</Link></span>
              </label>
              {errores.aceptaTerminos && <p className="campo-mensaje-error">{errores.aceptaTerminos}</p>}
            </div>
            <Boton tipo="submit" variante="primario" deshabilitado={cargando} className="acceso-btn-lleno">
              {cargando ? "Creando cuenta..." : "Crear cuenta"}
            </Boton>
          </form>
          <p className="acceso-pie">¿Ya tienes cuenta? <Link to="/login" className="acceso-link">Inicia sesión</Link></p>
        </div>
      </main>
    </div>);}