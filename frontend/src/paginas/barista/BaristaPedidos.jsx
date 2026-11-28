import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Tabla from "../../componentes/Tabla";
import ChipEstado from "../../componentes/ChipEstado";
import Boton from "../../componentes/Boton";
import Modal from "../../componentes/Modal";
import Cargando from "../../componentes/Cargando";
import MensajeError from "../../componentes/MensajeError";
import "../admin/admin.css";

const ESTADOS = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

// Siguiente paso de cada pedido: Pendiente -> En preparacion -> Listo -> Entregado
const SIGUIENTE = {
  PENDIENTE: { estado: "EN_PREPARACION", texto: "Preparar", variante: "secundario" },
  EN_PREPARACION: { estado: "LISTO", texto: "Marcar listo", variante: "primario" },
  LISTO: { estado: "ENTREGADO", texto: "Entregar", variante: "secundario" },
};

// Fecha de hoy en formato AAAA-MM-DD (hora local)
const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function BaristaPedidos() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [fecha, setFecha] = useState(hoy());
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [porMarcarListo, setPorMarcarListo] = useState(null);

  const cargar = async (pag = 0) => {
    setCargando(true);
    setError("");
    try {
      const params = { page: pag, size: 10 };
      if (q.trim()) params.q = q.trim();
      if (estado) params.estado = estado;
      if (fecha) params.fecha = fecha;
      const { data } = await cliente.get("/barista/pedidos", { params });
      setLista(data.contenido || []);
      setPagina(data.pagina ?? pag);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      setError(err.mensaje || "No se pudieron cargar los pedidos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => cargar(0), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, estado, fecha]);

  // Refresca la cola cada 30 segundos para ver pedidos nuevos sin recargar
  useEffect(() => {
    const id = setInterval(() => cargar(pagina), 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, q, estado, fecha]);

  const cambiarEstado = async (pedido, nuevo) => {
    setMsg("");
    try {
      await cliente.patch(`/barista/pedidos/${pedido.id}/estado`, { estado: nuevo });
      setMsg(
        nuevo === "LISTO"
          ? `${pedido.codigo} está listo. Avisamos a ${pedido.cliente?.nombre || "el cliente"} por correo, SMS y WhatsApp.`
          : `${pedido.codigo} actualizado a ${ESTADOS[nuevo]}.`
      );
      cargar(pagina);
    } catch (err) {
      setError(err.mensaje || "No se pudo cambiar el estado.");
    }
  };

  const verDetalle = async (id) => {
    try {
      const { data } = await cliente.get(`/barista/pedidos/${id}`);
      setDetalle(data);
    } catch (err) {
      setError(err.mensaje || "No se pudo abrir el pedido.");
    }
  };

  const textoDetalle = (p) => {
    if (!p) return "";
    const lineas = (p.items || []).map(
      (i) =>
        `${i.cantidad}x ${i.producto}${i.tamano ? ` (${i.tamano}` : ""}${i.leche ? `, ${i.leche}` : ""}${i.tamano ? ")" : ""}`
    );
    if (p.notas) lineas.push(`Notas: ${p.notas}`);
    return lineas.join(" • ") || "Sin detalles adicionales.";
  };

  return (
    <div className="admin-pagina">
      <Navbar usuario={usuario} alCerrarSesion={async () => { await logout(); navigate("/login"); }} />
      <main className="admin-contenedor">
        <div className="admin-encabezado">
          <h1 className="admin-titulo">Pedidos del día</h1>
        </div>

        <div className="admin-resumen">
          {[
            ["PENDIENTE", "Por preparar", "rgba(217, 138, 61, 0.18)"],
            ["EN_PREPARACION", "En preparación", "rgba(47, 111, 106, 0.14)"],
            ["LISTO", "Listos para recoger", "rgba(46, 125, 79, 0.14)"],
            ["ENTREGADO", "Entregados", "var(--crema-oscura)"],
          ].map(([clave, titulo, bg]) => (
            <div key={clave} className="admin-tarjeta-stat" style={{ backgroundColor: bg }}>
              <p className="admin-stat-num">{lista.filter((p) => p.estado === clave).length}</p>
              <p className="admin-stat-label">{titulo}</p>
            </div>
          ))}
        </div>

        <div className="admin-filtros">
          <input
            type="text"
            className="admin-input"
            placeholder="Buscar por pedido o cliente..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="admin-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Estado: Todos</option>
            {Object.entries(ESTADOS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input type="date" className="admin-select" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <Boton variante="secundario" onClick={() => setFecha("")}>Todas las fechas</Boton>
        </div>

        {msg && <div className="admin-aviso">{msg}</div>}

        {cargando ? (
          <Cargando texto="Cargando pedidos..." />
        ) : error ? (
          <MensajeError detalle={error} alReintentar={() => cargar(pagina)} />
        ) : (
          <Tabla
            columnas={[
              { titulo: "Pedido" },
              { titulo: "Cliente" },
              { titulo: "Total" },
              { titulo: "Recoger" },
              { titulo: "Estado" },
              { titulo: "Acción" },
            ]}
            datos={lista}
            paginaActual={pagina}
            totalPaginas={totalPaginas}
            alCambiarPagina={cargar}
            mensajeVacio={fecha ? "No hay pedidos para esta fecha." : "No hay pedidos con esos filtros."}
            renderFila={(p) => {
              const sig = SIGUIENTE[p.estado];
              return (
                <tr key={p.id}>
                  <td>
                    <button type="button" className="admin-link-editar" onClick={() => verDetalle(p.id)}>
                      {p.codigo}
                    </button>
                  </td>
                  <td>{p.cliente?.nombre || "—"}</td>
                  <td>${Number(p.total || 0).toFixed(2)}</td>
                  <td>
                    {p.horaRecogida
                      ? new Date(p.horaRecogida).toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" })
                      : "—"}
                  </td>
                  <td><ChipEstado estado={ESTADOS[p.estado] || p.estado} /></td>
                  <td>
                    {sig ? (
                      <Boton
                        variante={sig.variante}
                        onClick={() =>
                          sig.estado === "LISTO" ? setPorMarcarListo(p) : cambiarEstado(p, sig.estado)
                        }
                      >
                        {sig.texto}
                      </Boton>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            }}
          />
        )}

        <Modal
          abierto={Boolean(detalle)}
          titulo={`Pedido ${detalle?.codigo || ""} — ${detalle?.cliente?.nombre || ""}`}
          mensaje={textoDetalle(detalle)}
          textoConfirmar="Cerrar"
          alConfirmar={() => setDetalle(null)}
          alCancelar={() => setDetalle(null)}
        />

        <Modal
          abierto={Boolean(porMarcarListo)}
          titulo={`¿Marcar ${porMarcarListo?.codigo || ""} como listo?`}
          mensaje={`Se avisará a ${porMarcarListo?.cliente?.nombre || "el cliente"} por correo, SMS y WhatsApp que ya puede recoger su pedido.`}
          textoConfirmar="Sí, está listo"
          alConfirmar={() => {
            const p = porMarcarListo;
            setPorMarcarListo(null);
            cambiarEstado(p, "LISTO");
          }}
          alCancelar={() => setPorMarcarListo(null)}
        />
      </main>
    </div>
  );
}
