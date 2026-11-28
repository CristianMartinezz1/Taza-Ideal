import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Boton from "../../componentes/Boton";
import Campo from "../../componentes/Campo";
import Cargando from "../../componentes/Cargando";
import "./admin.css";
export default function AdminCategoriaForm() {
  const { usuario, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(Boolean(id));

  useEffect(() => {
     if(id) {
      cliente.get(`/admin/categorias/${id}`)
        .then((res) => {
          setNombre(res.data.nombre || "");
          setDescripcion(res.data.descripcion || "");
          setActivo(res.data.activo);
        })
        .finally(() => setCargando(false));
    }
  }, [id]);
  const guardar = async (e) => {
    e.preventDefault();
    setErrores({});
    try {
      const body = { nombre, descripcion, activo };
      if (id) {
        await cliente.put(`/admin/categorias/${id}`, body);
      } else {
        await cliente.post("/admin/categorias", body);
      }
      navigate("/admin/categorias");
    } catch (err) {
      setErrores(err.errores || {});
    }};
  return(
    <div className="admin-pagina">
      <Navbar usuario={usuario} alCerrarSesion={async () => { await logout(); navigate("/login"); }} />

          <main className="admin-contenedor">
          <h1 className="admin-titulo" style={{ textAlign: "center", marginBottom: "1rem" }}>
          {id ? "Editar categoría" : "Nueva categoría"}
          </h1>

            {cargando ? <Cargando texto="Cargando categoría..." /> : (
            <form className="admin-form-centrado" onSubmit={guardar}>
            <Campo
              etiqueta="Nombre de la categoría"
              nombre="nombre"
              valor={nombre}
              placeholder="Postres"
              onChange={(e) => {
                setNombre(e.target.value);
                setErrores({ ...errores, nombre: e.target.value.trim().length > 0 && e.target.value.trim().length < 2 ? "Mínimo 2 caracteres" : "" });
              }}
              error={errores.nombre}
            />
            <Campo
              etiqueta="Descripción"
              nombre="descripcion"
              valor={descripcion}
              placeholder="Pasteles y galletas para acompañar tu café"
              onChange={(e) => setDescripcion(e.target.value)}
              error={errores.descripcion}
            />
            {id && (
              <label className="admin-fila-toggle">
                <span>Categoría activa</span>
                <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
              </label>
            )}
            <div className="admin-form-botones">
              <Boton variante="secundario" onClick={() => navigate("/admin/categorias")}>Cancelar</Boton>
              <Boton tipo="submit" variante="primario">Guardar categoría</Boton>
            </div>
          </form>
        )}
      </main>
    </div>);}