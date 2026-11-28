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
import "./admin.css";

export default function AdminProductos() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [q, setQ] = useState("");
  const [catFiltro, setCatFiltro] = useState("");
  const [dispFiltro, setDispFiltro] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [borrar, setBorrar] = useState(null);

  const cargar = async (pag = 0) => {
    setCargando(true);
    setError("");
    try {
      const params = { page: pag, size: 6 };
      if (q) params.q = q;
      if (catFiltro) params.categoriaId = catFiltro;
      if (dispFiltro !== "") params.disponible = dispFiltro;
      const res = await cliente.get("/admin/productos", { params });
      setLista(res.data.contenido || []);
      setPagina(res.data.pagina ?? pag);
      setTotalPaginas(res.data.totalPaginas || 1);
    } catch (e) {
      setError(e.mensaje || "No se pudieron cargar los productos.");
    }
    setCargando(false);
  };
  useEffect(() => {
    cliente.get("/categorias").then((res) => setCategorias(res.data || []));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => cargar(0), 250);
    return () => clearTimeout(t);
  }, [q, catFiltro, dispFiltro]);

  const confirmarEliminar = async () => {
    try {
      await cliente.delete(`/admin/productos/${borrar.id}`);
      setMsg("Producto eliminado.");
      setBorrar(null);
      cargar(pagina);
    } catch (err) {
      setError(err.mensaje || "No se pudo eliminar.");
      setBorrar(null);
    }};
  return (
    <div className="admin-pagina">
      <Navbar usuario={usuario} alCerrarSesion={async () => { await logout(); navigate("/login"); }} />

       <main className="admin-contenedor">
        <div className="admin-encabezado">
          <h1 className="admin-titulo">Productos del menú</h1>
          <Boton variante="primario" onClick={() => navigate("/admin/productos/nuevo")}>Nuevo producto</Boton>
        </div>
        <div className="admin-filtros">
          <input type="text" className="admin-input" placeholder="Buscar bebida..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="admin-select" value={catFiltro} onChange={(e) => setCatFiltro(e.target.value)}>
            <option value="">Categoría: Todas</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <select className="admin-select" value={dispFiltro} onChange={(e) => setDispFiltro(e.target.value)}>
            <option value="">Disponibilidad: Todas</option>
            <option value="true">Disponible</option>
            <option value="false">Agotado</option>
          </select>
        </div>

        {msg && <div className="admin-aviso">{msg}</div>}
        {cargando ? <Cargando texto="Cargando productos..." /> : error ? <MensajeError detalle={error} alReintentar={() => cargar(pagina)} /> : (
          <Tabla
            columnas={[{ titulo: "Bebida" }, { titulo: "Categoría" }, { titulo: "Precio" }, { titulo: "Disponibilidad" }, { titulo: "Acciones" }]}
            datos={lista}
            paginaActual={pagina}
            totalPaginas={totalPaginas}
            alCambiarPagina={cargar}
            mensajeVacio="No hay productos."
            renderFila={(p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.categoria?.nombre || "—"}</td>
                <td>${Number(p.precio || 0).toFixed(0)} MXN</td>
                <td><ChipEstado estado={p.disponible ? "ACTIVO" : "INACTIVO"} /></td>
                <td>
                  <button type="button" className="admin-link-editar" onClick={() => navigate(`/admin/productos/${p.id}`)}>Editar</button>
                  <button type="button" className="admin-link-peligro" onClick={() => setBorrar(p)}>Eliminar</button>
                </td>
              </tr>)}
          />)}

        <Modal
          abierto={Boolean(borrar)}
          titulo={`¿Eliminar ${borrar?.nombre || ""}?`}
          mensaje="Esta acción no se puede deshacer."
          textoConfirmar="Sí, eliminar"
          varianteConfirmar="peligro"
          alConfirmar={confirmarEliminar}
          alCancelar={() => setBorrar(null)}
        />
      </main>
    </div>
  );
}