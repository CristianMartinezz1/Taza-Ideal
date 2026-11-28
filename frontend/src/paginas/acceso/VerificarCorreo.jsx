import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import cliente from "../../api/cliente";
import { AuthContext } from "../../context/AuthContext";
import Boton from "../../componentes/Boton";
import MensajeError from "../../componentes/MensajeError";
import Logo from "../../componentes/Logo";
import "./acceso.css";

export default function VerificarCorreo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, actualizarUsuario } = useContext(AuthContext) || {};

  const correoDestino =
    location.state?.correo || usuario?.correo || "tu correo electrónico";

  const [digitos, setDigitos] = useState(["", "", "", "", "", ""]);
  const [errorCodigo, setErrorCodigo] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [segundos, setSegundos] = useState(45);
  const [cargando, setCargando] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (segundos <= 0) return;
    const timer = setInterval(() => {
      setSegundos((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [segundos]);

  function manejarCambio(indice, valor) {
    const limpio = valor.replace(/\D/g, "").slice(-1);
    const nuevos = [...digitos];
    nuevos[indice] = limpio;
    setDigitos(nuevos);
    if (errorCodigo) setErrorCodigo("");

    if (limpio && indice < 5) {
      inputsRef.current[indice + 1]?.focus();
    }
  }

  function manejarTecla(indice, e) {
    if (e.key === "Backspace" && !digitos[indice] && indice > 0) {
      inputsRef.current[indice - 1]?.focus();
    }
  }

  function manejarPegado(e) {
    e.preventDefault();
    const pegado = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pegado) return;

    const nuevos = ["", "", "", "", "", ""];
    for (let i = 0; i < pegado.length; i++) {
      nuevos[i] = pegado[i];
    }
    setDigitos(nuevos);
    if (errorCodigo) setErrorCodigo("");

    const siguienteIdx = Math.min(pegado.length, 5);
    inputsRef.current[siguienteIdx]?.focus();
  }

  async function enviarVerificacion(e) {
    e.preventDefault();
    setErrorCodigo("");
    setErrorGeneral("");

    const codigo = digitos.join("");
    if (codigo.length < 6) {
      setErrorCodigo("Ingresa los 6 dígitos del código de verificación.");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await cliente.post("/auth/verificar", { codigo });
      if (actualizarUsuario && respuesta.data?.usuario) {
        actualizarUsuario(respuesta.data.usuario);
      }
      navigate("/inicio", { replace: true });
    } catch (error) {
      if (error.errores?.codigo) {
        setErrorCodigo(error.errores.codigo);
      } else if (error.estado === 400 || error.estado === 422) {
        setErrorCodigo(error.mensaje || "El código no es correcto.");
      } else {
        setErrorGeneral(error.mensaje || "No se pudo verificar la cuenta.");
      }
    } finally {
      setCargando(false);
    }
  }

  async function manejarReenviar() {
    if (segundos > 0 || reenviando) return;
    setErrorGeneral("");
    setErrorCodigo("");
    setReenviando(true);

    try {
      await cliente.post("/auth/reenviar-codigo");
      setSegundos(45);
      setDigitos(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (error) {
      setErrorGeneral(error.mensaje || "No se pudo reenviar el código.");
    } finally {
      setReenviando(false);
    }
  }

  const tiempoFormateado = `0:${String(segundos).padStart(2, "0")}`;

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

      {/* Lado derecho crema */}
      <main
        className="acceso-lado-form"
        style={{ backgroundImage: "none", backgroundColor: "var(--crema)" }}
      >
           < div className="acceso-tarjeta">
           <h2>Verifica tu correo</h2>
           <p className="acceso-tarjeta-sub">
            Te enviamos un código de 6 dígitos a <strong>{correoDestino}</strong>.
            Vence en 15 minutos.
           </p>

          {errorGeneral && <MensajeError mensaje={errorGeneral} />}

             <form onSubmit={enviarVerificacion} noValidate>
              <div className="otp-fila" onPaste={manejarPegado}>
              {digitos.map((digito, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digito}
                  aria-label={`Dígito ${idx + 1}`}
                  onChange={(e) => manejarCambio(idx, e.target.value)}
                  onKeyDown={(e) => manejarTecla(idx, e)}
                  className={`otp-casilla ${
                    errorCodigo ? "otp-casilla-error" : ""
                  }`.trim()}
                />
              ))}
              </div>

            {errorCodigo && <p className="verif-error-texto">{errorCodigo}</p>}

            <Boton
              tipo="submit"
              variante="primario"
              deshabilitado={cargando}
              className="acceso-btn-lleno"
            >
              {cargando ? "Verificando..." : "Verificar cuenta"}
            </Boton>
            </form>

            <div className="verif-aviso-verde">
            ¿No te llegó? Revisa tu carpeta de spam.
            {segundos > 0
              ? ` Podrás pedir un código nuevo en ${tiempoFormateado}.`
              : " Ya puedes solicitar un código nuevo."}
            </div>

           <div style={{ textAlign: "left" }}>
            <button
              type="button"
              onClick={manejarReenviar}
              disabled={segundos > 0 || reenviando}
              className="verif-btn-reenviar"
            >
              {reenviando ? "Reenviando..." : "Reenviar código"}
            </button>
      </div>
      </div>
      </main>
      </div>
  );
}