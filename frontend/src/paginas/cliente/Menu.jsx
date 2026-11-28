import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Boton from "../../componentes/Boton";
import Cargando from "../../componentes/Cargando";
import MensajeError from "../../componentes/MensajeError";
import "./cliente.css";

export default function Menu() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [orden, setOrden] = useState("precio,asc");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    cliente.get("/categorias").then(({ data }) => {
      setCategorias(Array.isArray(data) ? data : data?.contenido || []);
    }).catch(() => {});
  }, []);
  const cargarProductos = async () => {
    setCargando(true);
    setError("");
    try {
      const params = { page: pagina, size: 6, sort: orden };
      if (busqueda.trim()) params.q = busqueda.trim();
      if (categoriaId) params.categoriaId = categoriaId;

      const { data } = await cliente.get("/productos", { params });
      const lista = Array.isArray(data) ? data : data?.contenido || [];
      setProductos(lista);
      setTotalPaginas(Math.max(data?.totalPaginas ?? 1, 1));
      setTotalElementos(data?.totalElementos ?? lista.length);
    } catch (err) {
      setError(err.mensaje || "No pudimos cargar el menú.");
    } finally {
      setCargando(false);
    } };

  useEffect(() => {
    const timer = setTimeout(cargarProductos, 250);
    return () => clearTimeout(timer);
  }, [busqueda, categoriaId, orden, pagina]);

  const agregarAlCarrito = (prod) => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existente = carrito.find((item) => item.id === prod.id);
    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({
        id: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        imagenUrl: prod.imagenUrl || prod.imagen,
        tamano: "Chico",
        leche: "Leche entera",
        cantidad: 1,
      });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    setAviso(`"${prod.nombre}" agregado al carrito`);
    setTimeout(() => setAviso(""), 2200);
  };
  return (
    <div className="cliente-pagina">
      <Navbar usuario={usuario} alCerrarSesion={async () => { await logout(); navigate("/login"); }} />
        <main className="cliente-contenedor">
        <div className="menu-encabezado">
         <h1 className="menu-titulo">Menú</h1>
        <Boton variante="primario" onClick={() => navigate("/carrito")}>Ir al carrito</Boton>
        </div>
        <section className="menu-filtros">
          <input
            type="text"
            className="menu-input"
            placeholder="Buscar bebida..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(0); }} />
          <select className="menu-select" value={categoriaId} onChange={(e) => { setCategoriaId(e.target.value); setPagina(0); }}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <select className="menu-select" value={orden} onChange={(e) => { setOrden(e.target.value); setPagina(0); }}>
            <option value="precio,asc">Precio: menor a mayor</option>
            <option value="precio,desc">Precio: mayor a menor</option>
            <option value="nombre,asc">Nombre: A - Z</option>
          </select>
        </section>
        {cargando ? (
          <Cargando texto="Cargando bebidas del menú..." />
        ) : error ? (
          <MensajeError titulo="Error al cargar el menú" detalle={error} alReintentar={cargarProductos} />
        ) : productos.length === 0 ? (
          <div className="estado-caja">
            <p className="estado-texto">No encontramos bebidas que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <>
            <section className="menu-grid">
              {productos.map((prod) => (
                <article key={prod.id} className="menu-card">
                  <div>
                    <div className="menu-card-img">
                      {prod.imagenUrl || prod.imagen ? (
                        <img src={prod.imagenUrl || prod.imagen} alt={prod.nombre} />
                      ) : (
                        <span className="estado-texto">Sin foto</span>
                      )}
                    </div>
                    <div className="menu-card-cuerpo">
                      <h2 className="menu-card-nombre">{prod.nombre}</h2>
                      <p className="menu-card-desc">{prod.descripcion}</p>
                    </div>
                  </div>
                  <div className="menu-card-pie">
                    <span className="menu-card-precio">${Number(prod.precio || 0).toFixed(0)} MXN</span>
                    <Boton variante="secundario" onClick={() => agregarAlCarrito(prod)}>Agregar</Boton>
                  </div>
                </article>
              ))}
              </section>
              <footer className="menu-pie-pagina">
              <span className="menu-conteo">Mostrando {productos.length} de {totalElementos} bebidas</span>
              <div className="menu-paginacion">
                {Array.from({ length: totalPaginas }, (_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`menu-pag-btn ${pagina === idx ? "activa" : ""}`.trim()}
                    onClick={() => setPagina(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className="menu-pag-btn"
                  disabled={pagina + 1 >= totalPaginas}
                  onClick={() => setPagina((prev) => prev + 1)}
                >
                  &gt;
                </button>
              </div>
            </footer>
          </>
        )}
        {aviso && <div className="menu-aviso-agregado" role="status">{aviso}</div>}
         </main>
        </div>
  );
}