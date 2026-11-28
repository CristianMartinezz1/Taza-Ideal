import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Boton from "../../componentes/Boton";
import Cargando from "../../componentes/Cargando";
import MensajeError from "../../componentes/MensajeError";
import "./cliente.css";

export default function Resultado() {
  const { usuario, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [datos, setDatos] = useState(location.state?.resultado || null);
  const [cargando, setCargando] = useState(!location.state?.resultado);
  const [error, setError] = useState("");

  const cargarUltimoResultado = async () => {
    setCargando(true);
    setError("");
    try {
      const { data } = await cliente.get("/encuesta/ultima");
      setDatos(data);
    } catch (err) {
      setError(
        err.mensaje || "Aún no tienes una recomendación guardada. Contesta la encuesta."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!datos) {
      cargarUltimoResultado();
    }
  }, []);

  const manejarCerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  // Normaliza el formato de respuesta del backend (lista de 3 o principal + alternativas)
  const listaRecomendados = Array.isArray(datos)
    ? datos
    : datos?.recomendaciones ||
      (datos?.producto ? [datos.producto, ...(datos.otrasOpciones || [])] : datos ? [datos] : []);

  const principal = listaRecomendados[0] || null;
  const otrasOpciones = listaRecomendados.slice(1, 3);

  const coincidencia =
    principal?.porcentajeCoincidencia ||
    principal?.coincidencia ||
    datos?.porcentajeCoincidencia ||
    96;

  const agregarYIrAlCarrito = (prod) => {
    if (!prod?.id) {
      navigate("/menu");
      return;
    }
    const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existente = carritoActual.find((item) => item.id === prod.id);
    if (existente) {
      existente.cantidad += 1;
    } else {
      carritoActual.push({
        id: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        imagenUrl: prod.imagenUrl || prod.imagen,
        cantidad: 1,
      });
    }
    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    navigate("/carrito");
  };

  return (
          <div className="cliente-pagina">
          <Navbar usuario={usuario} alCerrarSesion={manejarCerrarSesion} />
 
          <main className="cliente-contenedor">
           <h1 className="resultado-titulo">Tu bebida ideal</h1>

        {cargando ? (
          <Cargando texto="Cargando tu recomendación..." />
        ) : error || !principal ? (
          <MensajeError
            titulo="Sin recomendación disponible"
            detalle={error || "Responde las 6 preguntas para descubrir tu bebida ideal."}
            alReintentar={() => navigate("/encuesta")}
          />
        ) : (
          <>
                <section className="resultado-principal">
                <div className="resultado-img-caja">
                {principal.imagenUrl || principal.imagen ? (
                  <img
                    src={principal.imagenUrl || principal.imagen}
                    alt={principal.nombre}
                  />
                ) : (
                  <span style={{ fontSize: "0.8rem", color: "rgba(43,29,20,0.5)" }}>
                    Sin foto
                  </span>
                )}
                 </div>

                <div>
                <span className="resultado-insignia">
                  {coincidencia}% de coincidencia con tus gustos
                </span>
                <h2 className="resultado-nombre">{principal.nombre}</h2>
                <p className="resultado-precio">
                  ${Number(principal.precio || 0).toFixed(0)} MXN
                </p>
                <p className="resultado-descripcion">
                  {principal.justificacion ||
                    principal.descripcion ||
                    "Elegimos esta bebida por su equilibrio entre aroma, textura y dulzor de acuerdo con tus respuestas."}
                 </p>

                <div className="resultado-acciones">
                  <Boton
                    variante="primario"
                    onClick={() => agregarYIrAlCarrito(principal)}
                  >
                    Pedir en línea
                  </Boton>

                  <Boton
                    variante="secundario"
                    onClick={() => navigate("/menu")}
                  >
                    Ver el menú completo
                  </Boton>

                  <button
                    type="button"
                    className="resultado-link-repetir"
                    onClick={() => navigate("/encuesta")}
                  >
                    Repetir encuesta
                  </button>
                  </div>
                 </div>
                  </section>

                   {otrasOpciones.length > 0 && (
                  <section>
                    <h2 className="resultado-subtitulo">Otras opciones para ti</h2>
                   <div className="resultado-otras-grid">
                  {otrasOpciones.map((opcion) => (
                    <article
                      key={opcion.id || opcion.nombre}
                      className="resultado-otra-card"
                      onClick={() => agregarYIrAlCarrito(opcion)}
                      title="Agregar al carrito"
                    >
                      <div className="resultado-otra-img">
                        {opcion.imagenUrl || opcion.imagen ? (
                          <img
                            src={opcion.imagenUrl || opcion.imagen}
                            alt={opcion.nombre}
                          />
                        ) : (
                          <span style={{ fontSize: "0.7rem", color: "rgba(43,29,20,0.5)" }}>
                            Sin foto
                          </span>
                        )}
                      </div>

                      <div>
                    <h3 className="resultado-otra-nombre">{opcion.nombre}</h3>
                    <p className="resultado-otra-precio">
                          ${Number(opcion.precio || 0).toFixed(0)} MXN
                     </p>
                      <p className="resultado-otra-desc">{opcion.descripcion}</p>
                      </div>
                      </article>
                  ))}
                </div>
                </section>
            )}
          </>
     )}
  </main>
    </div>
  );
}