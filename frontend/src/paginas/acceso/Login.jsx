import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import cliente from "../../api/cliente";
import { AuthContext } from "../../context/AuthContext";
import Campo from "../../componentes/Campo";
import Boton from "../../componentes/Boton";
import MensajeError from "../../componentes/MensajeError";
import "./acceso.css";
import Logo from "../../componentes/Logo";

export default function Login(){
  const { login } = useContext(AuthContext);
  const navegar = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando] = useState(false);

  function validar(){
    const nuevosErrores = {};
    if (!correo.trim()){
      nuevosErrores.correo = "Escribe tu correo electrónico";
    } else if (!correo.includes("@")) {
      nuevosErrores.correo = "El correo no es válido";
    }
    if (!contrasena) {
      nuevosErrores.contrasena = "Escribe tu contraseña";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function enviarFormulario(e) {
    e.preventDefault();
    setErrorGeneral("");

    if (!validar()) return;

    setCargando(true);
    try {
      const respuesta = await cliente.post("/auth/login", { correo, contrasena });
      const { token, usuario } = respuesta.data;

      login(usuario, token);

      if (!usuario.correoVerificado) {
        navegar("/verificar-correo");
      } else if (usuario.rol === "ADMIN") {
        navegar("/admin/usuarios");
      } else if (usuario.rol === "BARISTA") {
        navegar("/barista/pedidos");
      } else {
        navegar("/inicio");
      }
    } catch (error) {
      if (error.errores && Object.keys(error.errores).length > 0) {
        setErrores(error.errores);
      } else {
        setErrorGeneral(error.mensaje || "Correo o contraseña incorrectos");
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

      {/* Lado derecho con tarjeta blanca */}
      <main className="acceso-lado-form">
          <div className="acceso-tarjeta">
          <h2>Iniciar sesión</h2>
          <p className="acceso-tarjeta-sub">
            Entra con tu correo electrónico y contraseña.
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
            if (errores.correo) setErrores({ ...errores, correo: "" });
              }}
              placeholder="ana.lopez@correo.com"
              error={errores.correo}
              requerido
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
              requerido
            />

            <div className="acceso-enlace-derecha">
              <Link to="/recuperar" className="acceso-link">
             ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Boton
              tipo="submit"
              variante="primario"
              deshabilitado={cargando}
              className="acceso-btn-lleno"
            >
              {cargando ? "Entrando..." : "Entrar"}
            </Boton>
          </form>

          <p className="acceso-pie">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="acceso-link">
              Regístrate
            </Link>
          </p>
        </div>
      </main>
      </div>
  );
}