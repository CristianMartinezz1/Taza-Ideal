import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Tabla from "../../componentes/Tabla";
import ChipEstado from "../../componentes/ChipEstado";
import Modal from "../../componentes/Modal";
import Cargando from "../../componentes/Cargando";
import MensajeError from "../../componentes/MensajeError";
import "./cliente.css";

const ESTADOS = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const COLUMNAS = [
  { titulo: "Pedido" },
  { titulo: "Fecha" },
  { titulo: "Bebidas" },
  { titulo: "Total" },
  { titulo: "Estado" },
  { titulo: "Acción" },
];

export default function MisPedidos() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [diasFiltro, setDiasFiltro] = useState("30");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [cargando, setCargando] = useState(true);
  const [errorRed, setErrorRed] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");
  const [aCancelar, setACancelar] = useState(null);

  const cargarPedidos = async (pag = 0) => {
    setCargando(true);
    setErrorRed("");
    try {
      const params = { page: pag, size: 6 };
      if (estadoFiltro) params.estado = estadoFiltro;
      const { data } = await cliente.get("/pedidos/mios", { params });
      setPedidos(data.contenido || []);
      setPagina(data.pagina ?? pag);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      setErrorRed(err.mensaje || "No pudimos conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos(0);
  }, [estadoFiltro]);

  const confirmarCancelacion = async () => {
    try {
      await cliente.patch(`/pedidos/${aCancelar.id}/cancelar`);
      setMensajeOk(`Pedido #${aCancelar.codigo || aCancelar.id} cancelado.`);
      setACancelar(null);
      cargarPedidos(pagina);
    } catch (err) {
      setACancelar(null);
      setErrorRed(err.mensaje || "No se pudo cancelar el pedido.");
    }
  };

  const resumirBebidas = (p) => {
    if (!p.items?.length) return p.notas || "Pedido en tienda";
    const primero = p.items[0].productoNombre || p.items[0].nombre || "Bebida";
    return p.items.length > 1 ? `${primero} + ${p.items.length - 1}` : primero;
  };

  const pedidosVisibles = pedidos.filter((p) => {
    if (diasFiltro !== "todos" && p.creadoEn) {
      const limite = new Date(Date.now() - Number(diasFiltro) * 86400000);
      if (new Date(p.creadoEn) < limite) return false;
    }
    const q = busqueda.trim().toLowerCase();
    return !q || String(p.codigo || p.id).toLowerCase().includes(q) || resumirBebidas(p).toLowerCase().includes(q);
  });

  return (
    <div className="cliente-pagina">
      <Navbar usuario={usuario} alCerrarSesion={async () => { await logout(); navigate("/login"); }} />

      <main className="cliente-contenedor">
        <h1 className="pedidos-titulo">Mis pedidos</h1>

        <div className="pedidos-filtros">
          <input
            type="text"
            className="menu-input pedidos-buscador"
            placeholder="Buscar por número o bebida..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select className="menu-select pedidos-select" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Estado: Todos</option>
            {Object.entries(ESTADOS).map(([clave, texto]) => (
              <option key={clave} value={clave}>{texto}</option>
            ))}
          </select>
          <select className="menu-select pedidos-select" value={diasFiltro} onChange={(e) => setDiasFiltro(e.target.value)}>
            <option value="30">Fecha: Últimos 30 días</option>
            <option value="7">Últimos 7 días</option>
            <option value="todos">Todos los pedidos</option>
          </select>
        </div>

        {mensajeOk && <div className="pedidos-aviso">{mensajeOk}</div>}

        {cargando ? (
          <Cargando texto="Cargando pedidos..." />
        ) : errorRed ? (
          <MensajeError titulo="Error de conexión" detalle={errorRed} alReintentar={() => cargarPedidos(pagina)} />
        ) : (
          <Tabla
            columnas={COLUMNAS}
            datos={pedidosVisibles}
            paginaActual={pagina}
            totalPaginas={totalPaginas}
            alCambiarPagina={cargarPedidos}
            mensajeVacio="No tienes pedidos con esos filtros."
             renderFila={(p) => (
                <tr key={p.id}>
                <td><strong>#{p.codigo || p.id}</strong></td>
                <td>{p.creadoEn ? new Date(p.creadoEn).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                <td>{resumirBebidas(p)}</td>
                <td><strong>${Number(p.total || 0).toFixed(0)} MXN</strong></td>
                <td><ChipEstado estado={ESTADOS[p.estado] || p.estado} /></td>
                <td>
                  {p.estado === "PENDIENTE" ? (
                    <button type="button" className="pedidos-accion-cancelar" onClick={() => setACancelar(p)}>
                 Cancelar
                    </button>
              ) : (
               <span className="pedidos-guion">—</span>
                  )}
                </td>
              </tr>
            )}
          />
        )}

        <Modal
          abierto={Boolean(aCancelar)}
          titulo={`¿Cancelar el pedido #${aCancelar?.codigo || aCancelar?.id || ""}?`}
          mensaje="Esta acción no se puede deshacer. Te avisaremos por correo y SMS de la cancelación."
          textoConfirmar="Sí, cancelar pedido"
          textoCancelar="No, volver"
          varianteConfirmar="peligro"
          alConfirmar={confirmarCancelacion}
          alCancelar={() => setACancelar(null)}
        />
         </main>
         </div>
      );
      }