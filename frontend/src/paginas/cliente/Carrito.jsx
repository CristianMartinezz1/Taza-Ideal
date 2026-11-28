import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Boton from "../../componentes/Boton";
import Modal from "../../componentes/Modal";
import Cargando from "../../componentes/Cargando";
import "./cliente.css";

function obtenerHoraPorDefecto() {
  const ahora = new Date(Date.now() + 25 * 60000);
  const horas = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
}

export default function Carrito() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem("carrito") || "[]");
  });

  const [hora, setHora] = useState(obtenerHoraPorDefecto);
  const [notas, setNotas] = useState("");
  const [errorForm, setErrorForm] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const guardarItems = (nuevos) => {
    setItems(nuevos);
    localStorage.setItem("carrito", JSON.stringify(nuevos));
  };

  const cambiarCantidad = (idx, delta) => {
    const copia = [...items];
    const nuevaCant = copia[idx].cantidad + delta;
    if (nuevaCant < 1 || nuevaCant > 20) return;
    copia[idx].cantidad = nuevaCant;
    guardarItems(copia);
  };

  const cambiarOpcion = (idx, campo, valor) => {
    const copia = [...items];
    copia[idx][campo] = valor;
    guardarItems(copia);
  };

  const quitarItem = (idx) => {
    const copia = items.filter((_, i) => i !== idx);
    guardarItems(copia);
  };

  const totalProductos = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalMonto = items.reduce(
    (acc, item) => acc + Number(item.precio || 0) * item.cantidad,
    0
  );

  const manejarCerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  const construirFechaFutura = () => {
    const [hh, mm] = hora.split(":").map(Number);
    const fecha = new Date();
    fecha.setHours(hh, mm, 0, 0);
    // Si la hora elegida ya pasó hoy, la mandamos para mañana
    if (fecha <= new Date()) {
      fecha.setDate(fecha.getDate() + 1);
    }
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    const hStr = String(fecha.getHours()).padStart(2, "0");
    const mStr = String(fecha.getMinutes()).padStart(2, "0");
    return `${anio}-${mes}-${dia}T${hStr}:${mStr}:00`;
  };

  const abrirConfirmacion = () => {
    setErrorForm("");
    if (items.length === 0) {
      setErrorForm("Tu carrito está vacío.");
      return;
    }
    if (!hora) {
      setErrorForm("Selecciona una hora de recogida.");
      return;
    }
    if (notas.length > 255) {
      setErrorForm("Las notas no pueden pasar de 255 caracteres.");
      return;
    }
    setMostrarModal(true);
  };

  const confirmarPedido = async () => {
    setMostrarModal(false);
    setEnviando(true);
    setErrorForm("");

    try {
      const payload = {
        items: items.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
          tamano: item.tamano || "Chico",
          leche: item.leche || "Leche entera",
        })),
        horaRecogida: construirFechaFutura(),
        notas: notas.trim() || null,
      };

      const { data } = await cliente.post("/pedidos", payload);
      localStorage.removeItem("carrito");
      navigate("/pedido-confirmado", { state: { pedido: data } });
    } catch (err) {
      const detalleCampo = Object.values(err.errores || {})[0];
      setErrorForm(detalleCampo || err.mensaje || "No se pudo crear el pedido.");
      setEnviando(false);
    }
  };

  return (
    <div className="cliente-pagina">
      <Navbar usuario={usuario} alCerrarSesion={manejarCerrarSesion} />

        <main className="cliente-contenedor">
        <h1 className="carrito-titulo">Tu pedido</h1>

            {enviando ? (
          <Cargando texto="Confirmando tu pedido..." />
           ) : items.length === 0 ? (
          <div className="estado-caja">
            <p className="estado-texto" style={{ marginBottom: "1rem" }}>
              Aún no tienes bebidas en tu carrito.
            </p>
              <Boton variante="primario" onClick={() => navigate("/menu")}>
              Ver menú
            </Boton>
          </div>
            ) : (
               <div className="carrito-layout">
            {/* Lista de bebidas */}
               <section className="carrito-lista">
              {items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="carrito-item">
                  <div className="carrito-item-izq">
                    <img
                      src={item.imagenUrl || "/img/latte.jpg"}
                      alt={item.nombre}
                      className="carrito-item-foto"
                    />
                    <div>
                      <h2 className="carrito-item-nombre">{item.nombre}</h2>
                      <div className="carrito-item-opciones">
                        <select
                          className="carrito-mini-select"
                          value={item.tamano || "Chico"}
                          onChange={(e) =>
                            cambiarOpcion(idx, "tamano", e.target.value)
                          }
                        >
                          <option value="Chico">Chico</option>
                          <option value="Mediano">Mediano</option>
                          <option value="Grande">Grande</option>
                        </select>

                        <select
                          className="carrito-mini-select"
                          value={item.leche || "Leche entera"}
                          onChange={(e) =>
                            cambiarOpcion(idx, "leche", e.target.value)
                          }
                        >
                          <option value="Leche entera">Leche entera</option>
                          <option value="Leche deslactosada">Deslactosada</option>
                          <option value="Leche de almendra">Almendra</option>
                          <option value="Sin leche">Sin leche</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        className="carrito-quitar"
                        onClick={() => quitarItem(idx)}
                      >
                        Quitar
                      </button>
                      </div>
                     </div>

                     <div className="carrito-item-der">
                     <div className="carrito-cantidad">
                      <button
                        type="button"
                        className="carrito-cant-btn"
                        onClick={() => cambiarCantidad(idx, -1)}
                      >
                        -
                      </button>
                      <span className="carrito-cant-num">{item.cantidad}</span>
                      <button
                        type="button"
                        className="carrito-cant-btn"
                        onClick={() => cambiarCantidad(idx, 1)}
                      >
                        +
                      </button>
                    </div>

                    <span className="carrito-subtotal">
                      ${(Number(item.precio || 0) * item.cantidad).toFixed(0)} MXN
                    </span>
                  </div>
                </div>
                   ))}
                </section>

               {/* Resumen */}
               <aside className="carrito-resumen">
              <h2 className="carrito-resumen-titulo">Resumen</h2>

              <div className="carrito-campo">
                <label className="carrito-label" htmlFor="horaRecogida">
                  Hora de recogida
                </label>
                <input
                  id="horaRecogida"
                  type="time"
                  className="menu-input"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                />
                <p className="carrito-ayuda">Recoge sin filas en el mostrador.</p>
               </div>

              <div className="carrito-campo">
                <label className="carrito-label" htmlFor="notasPedido">
                  Notas para el barista (opcional)
                </label>
                <input
                  id="notasPedido"
                  type="text"
                  className="menu-input"
                  placeholder="Sin azúcar extra"
                  maxLength={255}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>

              {errorForm && (
                <p className="campo-mensaje-error" style={{ marginBottom: "0.75rem" }}>
                  {errorForm}
                </p>
              )}

              <div className="carrito-total-fila">
                <span>Total</span>
                <span className="carrito-total-monto">
                  ${totalMonto.toFixed(0)} MXN
                </span>
              </div>

              <Boton
                variante="primario"
                className="w-full"
                onClick={abrirConfirmacion}
              >
                Confirmar pedido
              </Boton>

              <Link to="/menu" className="carrito-link-menu">
                Seguir viendo el menú
              </Link>
            </aside>
          </div>
        )}

        <Modal
          abierto={mostrarModal}
          titulo="¿Confirmar tu pedido?"
          mensaje={`Pedirás ${totalProductos} bebida(s) por $${totalMonto.toFixed(
            0
          )} MXN para recoger a las ${hora}. Te avisaremos por correo, SMS y WhatsApp.`}
          textoConfirmar="Sí, confirmar pedido"
          textoCancelar="Cancelar"
          alConfirmar={confirmarPedido}
          alCancelar={() => setMostrarModal(false)}
        />
      </main>
       </div>
   );
    }