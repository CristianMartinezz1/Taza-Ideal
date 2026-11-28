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

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando] = useState(false);

  // Reglas de contraseña
  const tieneLargo = contrasena.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(contrasena);
  const tieneNumero = /[0-9]/.test(contrasena);
  const tieneEspecial = /[^A-Za-z0-9]/.test(contrasena);

  function validar() {
    const nuevosErrores = {};

    if (!nombre.trim()){
      nuevosErrores.nombre = "Escribe tu nombre completo";
    }
    if (!correo.trim() || !correo.includes("@")) {
      nuevosErrores.correo = "Escribe un correo válido, por ejemplo ana@correo.com";}
    if (!telefono.trim() || telefono.replace(/\D/g, "").length < 10) {
      nuevosErrores.telefono = "Escribe un teléfono válido de 10 dígitos";}
    if (!tieneLargo || !tieneMayuscula || !tieneNumero || !tieneEspecial) {
      nuevosErrores.contrasena = "La contraseña no cumple los requisitos";}
    if (confirmarContrasena !== contrasena || !confirmarContrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";}
    if (!aceptoTerminos) {
      nuevosErrores.aceptaTerminos = "Debes aceptar los Términos y la Política de privacidad";}

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function enviarFormulario(e) {
    e.preventDefault();
    setErrorGeneral("");

    if (!validar()) return;

    setCargando(true);
    try {
      const respuesta = await cliente.post("/auth/registro", {
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        contrasena,
        aceptaTerminos: aceptoTerminos,
      });

      const { token, usuario } = respuesta.data;
      login(usuario, token);
      navegar("/verificar-correo");
    } catch (error) {
      if (error.errores && Object.keys(error.errores).length > 0) {
        setErrores(error.errores);
      } else {
        setErrorGeneral(error.mensaje || "No se pudo crear la cuenta");
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
          <h2>Crear cuenta</h2>

          {errorGeneral && <MensajeError mensaje={errorGeneral} />}

          <form onSubmit={enviarFormulario} noValidate>
            <Campo
              etiqueta="Nombre completo"
              nombre="nombre"
              valor={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (errores.nombre) setErrores({ ...errores, nombre: "" });
              }}
              placeholder="Ana López"
              error={errores.nombre}
            />

            <Campo
              etiqueta="Correo electrónico"
              tipo="email"
              nombre="correo"
              valor={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                if (errores.correo) setErrores({ ...errores, correo: "" });
              }}
              placeholder="ana.lopez@correo.com"
              error={errores.correo}
            />

            <Campo
              etiqueta="Teléfono (para SMS y WhatsApp)"
              tipo="tel"
              nombre="telefono"
              valor={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);
                if (errores.telefono) setErrores({ ...errores, telefono: "" });
              }}
              placeholder="+52 951 123 4567"
              ayuda="Te avisaremos cuando tu pedido esté listo"
              error={errores.telefono}
            />

            <Campo
              etiqueta="Contraseña"
              tipo="password"
              nombre="contrasena"
              valor={contrasena}
              onChange={(e) => {
                setContrasena(e.target.value);
                if (errores.contrasena) setErrores({ ...errores, contrasena: "" });
              }}
              placeholder="••••••••"
              error={errores.contrasena}
            />

            {/* Lista de reglas */}
            <div style={{ fontSize: "0.75rem", margin: "-0.3rem 0 0.85rem", lineHeight: 1.6 }}>
              <div style={{ color: tieneLargo ? "var(--verde)" : "var(--rojo)" }}>
                ● Mínimo 8 caracteres
              </div>
              <div style={{ color: tieneMayuscula ? "var(--verde)" : "var(--rojo)" }}>
                ● Al menos una mayúscula
              </div>
              <div style={{ color: tieneNumero ? "var(--verde)" : "var(--rojo)" }}>
                ● Al menos un número
              </div>
              <div style={{ color: tieneEspecial ? "var(--verde)" : "var(--rojo)" }}>
                ● Al menos un carácter especial (!@#$%)
              </div>
            </div>

            <Campo
              etiqueta="Confirmar contraseña"
              tipo="password"
              nombre="confirmarContrasena"
              valor={confirmarContrasena}
              onChange={(e) => {
                setConfirmarContrasena(e.target.value);
                if (errores.confirmarContrasena) {
                  setErrores({ ...errores, confirmarContrasena: "" });
                }
              }}
              placeholder="••••••••"
              error={errores.confirmarContrasena}
            />

            <div style={{ marginBottom: "0.9rem" }}>
              <label style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={aceptoTerminos}
                  onChange={(e) => {
                    setAceptoTerminos(e.target.checked);
                    if (errores.aceptaTerminos) {
                      setErrores({ ...errores, aceptaTerminos: "" });
                    }
                  }}
                />
                <span>
                  Acepto los{" "}
                  <Link to="/terminos" className="acceso-link">
                                      Términos y la Política de privacidad
                </Link>
                </span>
              </label>
              {errores.aceptaTerminos && (
                <p className="campo-mensaje-error">{errores.aceptaTerminos}</p>
              )}
            </div>

            <Boton
              tipo="submit"
              variante="primario"
              deshabilitado={cargando}
              className="acceso-btn-lleno"
            >
              {cargando ? "Creando cuenta..." : "Crear cuenta"}
            </Boton>
          </form>

          <p className="acceso-pie">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="acceso-link">
              Inicia sesión
            </Link>
      </p>
    </div>
              </main>
   </div>
  );
}