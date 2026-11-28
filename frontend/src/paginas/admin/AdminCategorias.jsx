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
export default function AdminCategorias() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [q, setQ] = useState("");
  const [activoFiltro, setActivoFiltro] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [avisoError, setAvisoError] = useState("");
  const [borrar, setBorrar] = useState(null);
  const cargar = async (pag = 0) => {
    setCargando(true);
    setError("");
    setAvisoError("");
    try {
      const params = { page: pag, size: 6 };
      if (q) params.q = q;
      if (activoFiltro !== "") params.activo = activoFiltro;

      const res = await cliente.get("/admin/categorias", { params });
      setLista(res.data.contenido || []);
      setPagina(res.data.pagina ?? pag);
      setTotalPaginas(res.data.totalPaginas || 1);
    } catch (e) {
      setError(e.mensaje || "No se pudieron cargar las categorías.");
    }
    setCargando(false);
  };

  useEffect(() => {
    const t = setTimeout(() => cargar(0), 250);
    return () => clearTimeout(t);
  }, [q, activoFiltro]);

  const confirmarEliminar = async () => {
    setMsg("");
    setAvisoError("");
    try {
      await cliente.delete(`/admin/categorias/${borrar.id}`);
      setMsg(`Categoría "${borrar.nombre}" eliminada.`);
      setBorrar(null);
      cargar(pagina);
    } catch (err) {
      setAvisoError(err.mensaje || "No se pudo eliminar la categoría.");
      setBorrar(null);}};
  return(
    <div className="admin-pagina">
      <Navbar usuario={usuario} alCerrarSesion={async () => { await logout(); navigate("/login"); }} />
          <main className="admin-contenedor">
          <div className="admin-encabezado">
          <h1 className="admin-titulo">Categorías</h1>
          <Boton variante="primario" onClick={() => navigate("/admin/categorias/nueva")}>Nueva categoría</Boton>
        </div>

           <div className="admin-filtros">
           <input type="text" className="admin-input" placeholder="Buscar categoría..." value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="admin-select" value={activoFiltro} onChange={(e) => setActivoFiltro(e.target.value)}>
            <option value="">Estado: Todos</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
            </select>
        </div>
        {msg && <div className="admin-aviso">{msg}</div>}
        {avisoError && <div className="admin-aviso-error">{avisoError}</div>}
        {cargando ? <Cargando texto="Cargando categorías..." /> : error ? <MensajeError detalle={error} alReintentar={() => cargar(pagina)} /> : (
          <Tabla
            columnas={[{ titulo: "Nombre" }, { titulo: "Descripción" }, { titulo: "Estado" }, { titulo: "Acciones" }]}
            datos={lista}
            paginaActual={pagina}
            totalPaginas={totalPaginas}
            alCambiarPagina={cargar}
            mensajeVacio="No hay categorías."
            renderFila={(c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.descripcion || "—"}</td>
                <td><ChipEstado estado={c.activo ? "ACTIVO" : "INACTIVO"} /></td>
                <td>
              <button type="button" className="admin-link-editar" onClick={() => navigate(`/admin/categorias/${c.id}`)}>Editar</button>
                 <button type="button" className="admin-link-peligro" onClick={() => setBorrar(c)}>Eliminar</button>
                </td>
              </tr> )}
          />)}
        <Modal
          abierto={Boolean(borrar)}
          titulo={`¿Eliminar la categoría ${borrar?.nombre || ""}?`}
          mensaje="Su producto quedará sin categoría. Esta acción no se puede deshacer."
          textoConfirmar="Sí, eliminar categoría"
          varianteConfirmar="peligro"
          alConfirmar={confirmarEliminar}
          alCancelar={() => setBorrar(null)}
        />
      </main>
    </div>);}