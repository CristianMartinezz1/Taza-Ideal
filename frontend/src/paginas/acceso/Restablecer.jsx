import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import cliente from "../../api/cliente";
import Campo from "../../componentes/Campo";
import Boton from "../../componentes/Boton";
import MensajeError from "../../componentes/MensajeError";
import Logo from "../../componentes/Logo";
import "./acceso.css";

// Misma regla que el backend: 8+ caracteres, una mayuscula, un numero y un caracter especial
const CONTRASENA_SEGURA = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/;

/**
 * Pantalla a la que llega el enlace del correo de recuperacion:
 * https://tazaideal.online/restablecer?token=...
 */
export default function Restablecer() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();
  const token = parametros.get("token") || "";

  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviarFormulario(e) {
    e.preventDefault();
    setErrorGeneral("");
    const nuevos = {};
    if (!CONTRASENA_SEGURA.test(contrasena)) {
      nuevos.contrasena =
        "Usa al menos 8 caracteres, una mayúscula, un número y un carácter especial";
    }
    if (confirmacion !== contrasena) {
      nuevos.confirmacion = "Las contraseñas no coinciden";
    }
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setCargando(true);
    try {
      const { data } = await cliente.post("/auth/restablecer", {
        token,
        contrasenaNueva: contrasena,
      });
      setMensajeExito(data?.mensaje || "Tu contraseña se cambió. Ya puedes iniciar sesión.");
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (error) {
      if (error.errores?.contrasenaNueva) {
        setErrores({ contrasena: error.errores.contrasenaNueva });
      } else {
        setErrorGeneral(error.mensaje || "No se pudo cambiar la contraseña");
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="acceso-contenedor">
      <aside className="acceso-marca">
        <div className="acceso-marca-caja">
          <div className="acceso-logo-circulo">
            <Logo tamano={105} />
          </div>
          <h1>Taza ideal</h1>
          <p className="acceso-subtitulo">El café que te entiende</p>
        </div>
      </aside>

      <main
        className="acceso-lado-form"
        style={{ backgroundImage: "none", backgroundColor: "var(--crema)" }}
      >
        <div className="acceso-tarjeta">
          <h2>Crear nueva contraseña</h2>

          {!token ? (
            <>
              <MensajeError mensaje="El enlace no es válido. Solicita uno nuevo." />
              <p className="acceso-pie" style={{ textAlign: "left" }}>
                <Link to="/recuperar" className="acceso-link">Solicitar un enlace nuevo</Link>
              </p>
            </>
          ) : mensajeExito ? (
            <div className="restablecer-exito">{mensajeExito}{mensajeExito.endsWith(".") ? "" : "."} Te llevamos a iniciar sesión…</div>
          ) : (
            <>
              <p className="acceso-tarjeta-sub">
                Escribe tu nueva contraseña. El enlace vence 30 minutos después de pedirlo.
              </p>

              {errorGeneral && <MensajeError mensaje={errorGeneral} />}

              <form onSubmit={enviarFormulario} noValidate>
                <Campo
                  etiqueta="Nueva contraseña"
                  tipo="password"
                  nombre="contrasena"
                  valor={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Taza#2026"
                  error={errores.contrasena}
                />
                <Campo
                  etiqueta="Confirma la contraseña"
                  tipo="password"
                  nombre="confirmacion"
                  valor={confirmacion}
                  onChange={(e) => setConfirmacion(e.target.value)}
                  placeholder="Repite la contraseña"
                  error={errores.confirmacion}
                />
                <Boton
                  tipo="submit"
                  variante="primario"
                  deshabilitado={cargando}
                  className="acceso-btn-lleno"
                >
                  {cargando ? "Guardando..." : "Guardar contraseña"}
                </Boton>
              </form>

              {errorGeneral && (
                <p className="acceso-pie" style={{ textAlign: "left" }}>
                  <Link to="/recuperar" className="acceso-link">Solicitar un enlace nuevo</Link>
                </p>
              )}
            </>
          )}

          <p className="acceso-pie" style={{ textAlign: "left" }}>
            <Link to="/login" className="acceso-link">Volver a iniciar sesión</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
