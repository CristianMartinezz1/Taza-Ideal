import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Boton from "../../componentes/Boton";
import Campo from "../../componentes/Campo";
import Cargando from "../../componentes/Cargando";
import "./admin.css";

export default function AdminProductoForm() {
  const { usuario, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [foto, setFoto] = useState(null);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(Boolean(id));
  useEffect(() => {
    cliente.get("/categorias").then((res) => {
      const cats = res.data || [];
      setCategorias(cats);
      if (!id && cats.length) setCategoriaId(cats[0].id);});
    if (id) {
      cliente.get(`/admin/productos/${id}`)
        .then((res) => {
          const p = res.data;
          setNombre(p.nombre || "");
          setCategoriaId(p.categoria?.id || "");
          setPrecio(String(p.precio ?? ""));
          setDescripcion(p.descripcion || "");
          setDisponible(p.disponible);
        })
        .finally(() => setCargando(false)); }
  }, [id]);
  const guardar = async (e) => {
    e.preventDefault();
    setErrores({});
    try {
      const body = { nombre, categoriaId: Number(categoriaId), precio: Number(precio), descripcion, disponible };
      const res = id
        ? await cliente.put(`/admin/productos/${id}`, body)
        : await cliente.post("/admin/productos", body);

      if (foto) {
        const fd = new FormData();
        fd.append("archivo", foto);
        await cliente.post(`/admin/productos/${res.data.id}/foto`, fd);
      }
      navigate("/admin/productos");
    } catch (err) {
      setErrores(err.errores || {});
    }};
     return(
    <div className="admin-pagina">
      <Navbar usuario={usuario} alCerrarSesion={async () => { await logout(); navigate("/login"); }} />

      <main className="admin-contenedor">
        <h1 className="admin-titulo" style={{ textAlign: "center", marginBottom: "1rem" }}>
          {id ? "Editar producto" : "Nuevo producto"}
        </h1>
           {cargando ? <Cargando texto="Cargando producto..." /> : (
            <form className="admin-form-centrado" onSubmit={guardar}>
            <Campo etiqueta="Nombre de la bebida" nombre="nombre" valor={nombre} placeholder="Latte de vainilla" onChange={(e) => setNombre(e.target.value)} error={errores.nombre} />

               <div className="campo-grupo">
              <label className="campo-etiqueta">Categoría</label>
              <select className="campo-input" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              {errores.categoriaId && <p className="campo-mensaje-error">{errores.categoriaId}</p>}
              </div>

            <Campo
              etiqueta="Precio (MXN)"
              nombre="precio"
              valor={precio}
              placeholder="62"
              onChange={(e) => {
                setPrecio(e.target.value);
                setErrores({ ...errores, precio: e.target.value && isNaN(e.target.value) ? "Escribe solo números, por ejemplo 62" : "" });
              }}
              error={errores.precio}/>

            <Campo etiqueta="Descripción" nombre="descripcion" valor={descripcion} placeholder="Café con leche y vainilla" onChange={(e) => setDescripcion(e.target.value)} error={errores.descripcion} />

            <div className="campo-grupo">
              <label className="campo-etiqueta">Foto (opcional)</label>
              <input type="file" accept="image/*" className="campo-input" onChange={(e) => setFoto(e.target.files[0])} />
            </div>
            <label className="admin-fila-toggle">
              <span>Disponible en el menú</span>
              <input type="checkbox" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} />
            </label>
            <div className="admin-form-botones">
              <Boton variante="secundario" onClick={() => navigate("/admin/productos")}>Cancelar</Boton>
              <Boton tipo="submit" variante="primario">Guardar producto</Boton>
            </div>
          </form> )}
      </main>
    </div>);}