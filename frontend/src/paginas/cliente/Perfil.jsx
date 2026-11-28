import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Avatar from "../../componentes/Avatar";
import Campo from "../../componentes/Campo";
import Boton from "../../componentes/Boton";
import Modal from "../../componentes/Modal";
import "./cliente.css";

export default function Perfil() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [telefono, setTelefono] = useState(usuario?.telefono || "");
  const [avisos, setAvisos] = useState({ correo: true, sms: true, whatsapp: false });

  const [verClave, setVerClave] = useState(false);
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");

  const [msg, setMsg] = useState("");
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalSalir, setModalSalir] = useState(false);

  const guardarDatos = async (e) => {
    e.preventDefault();
    setMsg("");
    setErrores({});
    setCargando(true);
    try {
      const { data } = await cliente.put("/perfil", { nombre, telefono: telefono || null });
      localStorage.setItem("usuario", JSON.stringify({ ...usuario, nombre: data.nombre, telefono: data.telefono }));
      setMsg("Cambios guardados.");
    } catch (err) {
      setErrores(err.errores || { general: err.mensaje });
    } finally {
      setCargando(false);
    }
  };

  const cambiarClave = async (e) => {
    e.preventDefault();
    setMsg("");
    setErrores({});
    setCargando(true);
    try {
      const { data } = await cliente.put("/perfil/contrasena", { contrasenaActual, contrasenaNueva });
      setContrasenaActual("");
      setContrasenaNueva("");
      setVerClave(false);
      setMsg(data.mensaje || "Contraseña actualizada.");
    } catch (err) {
      setErrores(err.errores || { general: err.mensaje });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="cliente-pagina">
      <Navbar usuario={{ ...usuario, nombre }} alCerrarSesion={() => setModalSalir(true)} />

      <main className="cliente-contenedor">
        <div className="perfil-caja">
          <div className="perfil-encabezado">
            <Avatar nombre={nombre} url={usuario?.avatar} tamano={56} />
            <div>
              <h1 className="perfil-nombre">{nombre}</h1>
              <p className="perfil-sub">{usuario?.correo} · {usuario?.rol}</p>
            </div>
          </div>

          {msg && <div className="pedidos-aviso">{msg}</div>}
          {errores.general && <p className="campo-mensaje-error">{errores.general}</p>}

          <form onSubmit={guardarDatos} className="perfil-tarjeta">
            <h2 className="perfil-tarjeta-titulo">Datos personales</h2>
            <Campo etiqueta="Nombre completo" nombre="nombre" valor={nombre} onChange={(e) => setNombre(e.target.value)} error={errores.nombre} />
            <Campo etiqueta="Teléfono (SMS y WhatsApp)" nombre="telefono" valor={telefono} placeholder="+52 951 123 4567" onChange={(e) => setTelefono(e.target.value)} error={errores.telefono} />

            <div className="perfil-botones">
              <Boton tipo="submit" variante="primario" deshabilitado={cargando}>Guardar cambios</Boton>
              <Boton variante="secundario" onClick={() => setVerClave(!verClave)}>Cambiar contraseña</Boton>
              <Boton variante="peligro" onClick={() => setModalSalir(true)}>Cerrar sesión</Boton>
            </div>
          </form>

          {verClave && (
            <form onSubmit={cambiarClave} className="perfil-tarjeta">
              <h2 className="perfil-tarjeta-titulo">Cambiar contraseña</h2>
              <Campo etiqueta="Contraseña actual" tipo="password" nombre="contrasenaActual" valor={contrasenaActual} onChange={(e) => setContrasenaActual(e.target.value)} error={errores.contrasenaActual} />
              <Campo etiqueta="Nueva contraseña" tipo="password" nombre="contrasenaNueva" valor={contrasenaNueva} onChange={(e) => setContrasenaNueva(e.target.value)} error={errores.contrasenaNueva} />
              <Boton tipo="submit" variante="primario" deshabilitado={cargando}>Actualizar</Boton>
            </form>
          )}

          <div className="perfil-tarjeta">
            <h2 className="perfil-tarjeta-titulo">¿Cómo quieres recibir avisos?</h2>
            {[["correo", "Correo electrónico"], ["sms", "SMS"], ["whatsapp", "WhatsApp"]].map(([key, label]) => (
              <div key={key} className="perfil-canal-fila">
                <span>{label}</span>
                <button
                  type="button"
                  className={`perfil-switch ${avisos[key] ? "prendido" : ""}`}
                  onClick={() => setAvisos({ ...avisos, [key]: !avisos[key] })}
                >
                  <span className="perfil-switch-bolita" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Modal
          abierto={modalSalir}
          titulo="¿Cerrar sesión?"
          mensaje="Tendrás que volver a iniciar sesión."
          textoConfirmar="Sí, salir"
          textoCancelar="Cancelar"
          varianteConfirmar="peligro"
          alConfirmar={async () => { await logout(); navigate("/login"); }}
          alCancelar={() => setModalSalir(false)}
        />
      </main>
    </div>
     );
     }