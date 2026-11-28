import { useState } from "react";
import { Link } from "react-router-dom";
import cliente from "../../api/cliente";
import Campo from "../../componentes/Campo";
import Boton from "../../componentes/Boton";
import MensajeError from "../../componentes/MensajeError";
import Logo from "../../componentes/Logo";
import "./acceso.css";

export default function Recuperar() {
  const [correo, setCorreo] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviarFormulario(e) {
    e.preventDefault();
    setErrorCorreo("");
    setErrorGeneral("");
    setMensajeExito("");

    if (!correo.trim() || !correo.includes("@")) {
      setErrorCorreo("Escribe un correo electrónico válido");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await cliente.post("/auth/recuperar", {
        correo: correo.trim(),
      });
      setMensajeExito(
        respuesta.data?.mensaje || "Listo, revisa tu bandeja de entrada."
      );
    } catch (error) {
      if (error.errores?.correo) {
        setErrorCorreo(error.errores.correo);
      } else {
        setErrorGeneral(error.mensaje || "No se pudo enviar el enlace");
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="acceso-contenedor">
      {/* Lado izquierdo café */}
        <aside className="acceso-marca">
        <div className="acceso-marca-caja">
          <div className="acceso-logo-circulo">
         <Logo tamano={105} />
          </div>
          <h1>Taza ideal</h1>
          <p className="acceso-subtitulo">El café que te entiende</p>
          <p className="acceso-descripcion">
            Responde 6 preguntas y te recomendamos la bebida de nuestro menú que
            mejor va con tu gusto. Pídela en línea y recógela sin filas.
          </p>
        </div>
      </aside>

      {/* Lado derecho con fondo crema */}
        <main
        className="acceso-lado-form"
        style={{ backgroundImage: "none", backgroundColor: "var(--crema)" }}
      >
          <div className="acceso-tarjeta">
          <h2>Recuperar contraseña</h2>
          <p className="acceso-tarjeta-sub">
            Escribe tu correo y te enviaremos un enlace para crear una nueva
            contraseña.
          </p>

          {errorGeneral && <MensajeError mensaje={errorGeneral} />}

          <form onSubmit={enviarFormulario} noValidate>
            <Campo
              etiqueta="Correo electrónico"
              tipo="email"
              nombre="correo"
              valor={correo}
              onChange={(e) => {
              setCorreo(e.target.value);
                if (errorCorreo) setErrorCorreo("");
              }}
              placeholder="ana.lopez@correo.com"
              error={errorCorreo}
            />

            <Boton
              tipo="submit"
              variante="primario"
              deshabilitado={cargando}
              className="acceso-btn-lleno"
            >
              {cargando ? "Enviando..." : "Enviar enlace por correo"}
            </Boton>
          </form>

          {mensajeExito && (
            <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem 0.9rem",
             borderRadius: "var(--radio-control)",
             backgroundColor: "rgba(46, 125, 79, 0.14)",
            border: "1px solid var(--verde)",
            color: "var(--verde)",
              fontSize: "0.8rem",
                fontWeight: 500,
              }}
            >
              {mensajeExito}
            </div>
          )}

          <p className="acceso-pie" style={{ textAlign: "left" }}>
            <Link to="/login" className="acceso-link">
              Volver a iniciar sesión
            </Link>
          </p>
     </div>
      </main>
      </div>
  );
}