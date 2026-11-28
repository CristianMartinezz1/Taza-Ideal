import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Boton from "../../componentes/Boton";
import ChipEstado from "../../componentes/ChipEstado";
import Cargando from "../../componentes/Cargando";
import MensajeError from "../../componentes/MensajeError";
import "./cliente.css";

export default function Inicio() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [recomendacion, setRecomendacion] = useState(null);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorRed, setErrorRed] = useState("");

  const primerNombre = (usuario?.nombre || "Cliente").trim().split(/\s+/)[0];

  const cargarDatos = async () => {
    setCargando(true);
    setErrorRed("");
    try {
      const [resEncuesta, resPedidos] = await Promise.allSettled([
        cliente.get("/encuesta/ultima"),
        cliente.get("/pedidos/mios", { params: { page: 0, size: 3 } }),
      ]);

      if (resEncuesta.status === "fulfilled") {
        setRecomendacion(resEncuesta.value.data);
      } else {
        setRecomendacion(null);
      }

      if (resPedidos.status === "fulfilled") {
        const data = resPedidos.value.data;
        setPedidosRecientes(data?.contenido || data?.content || []);
      } else if (resPedidos.reason?.estado === 0) {
        setErrorRed(resPedidos.reason.mensaje);
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  const manejarPedirDeNuevo = () => {
    const prod = recomendacion?.producto || recomendacion;
    // La recomendacion de la API trae productoId (no id)
    const idProducto = prod?.productoId ?? prod?.id;
    if (!idProducto) {
      navigate("/menu");
      return;
    }
    const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existente = carritoActual.find((item) => item.id === idProducto);
    if (existente) {
      existente.cantidad += 1;
    } else {
      carritoActual.push({
        id: idProducto,
        nombre: prod.nombre,
        precio: prod.precio,
        imagenUrl: prod.imagenUrl || prod.imagen,
        cantidad: 1,
      });
    }
    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    navigate("/carrito");
  };

  const productoRec = recomendacion?.producto || recomendacion;

  return (
        <div className="cliente-pagina">
      <Navbar usuario={usuario} alCerrarSesion={manejarCerrarSesion} />

          <main className="cliente-contenedor">
          <div className="inicio-saludo">
          <h1>Hola, {primerNombre}</h1>
          <p>¿Qué café va contigo hoy?</p>
          </div>

        {/* Fila superior: Banner + Última recomendación */}
        <section className="inicio-hero-grid">
          <div className="inicio-banner">
            <h2>El café que te entiende</h2>
            <p>
              Responde 6 preguntas y te recomendamos la bebida de nuestro menú
              que mejor va con tu gusto. Pídela en línea y recógela sin filas.
            </p>
            <Boton
              variante="acento"
              onClick={() => navigate("/encuesta")}
            >
              Contestar la encuesta
            </Boton>
          </div>

          <div className="inicio-recomendacion-card">
            <div>
              <p className="inicio-recomendacion-etiqueta">
                Tu última recomendación
              </p>

              {productoRec?.nombre ? (
                <>
                  <div className="inicio-recomendacion-img">
                    {productoRec.imagenUrl || productoRec.imagen ? (
                      <img
                        src={productoRec.imagenUrl || productoRec.imagen}
                        alt={productoRec.nombre}
                      />
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "rgba(43,29,20,0.5)" }}>
                        Bebida recomendada
                      </span>
                    )}
                  </div>
                  <h3 className="inicio-recomendacion-nombre">
                    {productoRec.nombre}
                  </h3>
                  <p className="inicio-recomendacion-precio">
                    ${Number(productoRec.precio || 0).toFixed(0)} MXN
                  </p>
                </>
              ) : (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(43, 29, 20, 0.7)",
                    margin: "1rem 0",
                  }}
                >
                  Aún no has respondido la encuesta. ¡Descúbrela en 1 minuto!
                </p>
              )}
            </div>

            {productoRec?.nombre ? (
              <Boton
                variante="primario"
                onClick={manejarPedirDeNuevo}
                className="inicio-btn-lleno"
              >
                Pedir de nuevo
              </Boton>
            ) : (
              <Boton
                variante="secundario"
                onClick={() => navigate("/encuesta")}
                className="inicio-btn-lleno"
              >
                Ir a la encuesta
              </Boton>
            )}
          </div>
        </section>

        {/* Mis pedidos recientes */}
        <section className="inicio-pedidos-seccion">
          <h2>Mis pedidos recientes</h2>

          {cargando ? (
            <Cargando texto="Cargando tus pedidos recientes..." />
          ) : errorRed ? (
            <MensajeError detalle={errorRed} alReintentar={cargarDatos} />
          ) : pedidosRecientes.length === 0 ? (
            <div className="inicio-pedido-fila">
              <span>Aún no tienes pedidos realizados.</span>
              <Link to="/menu" className="inicio-link-todos">
                Explorar el menú
              </Link>
            </div>
          ) : (
            <div className="inicio-pedidos-lista">
              {pedidosRecientes.map((pedido) => {
                const resumenProducto =
                  pedido.detalles?.[0]?.productoNombre ||
                  pedido.resumen ||
                  "Pedido de cafetería";
                return (
                  <div key={pedido.id} className="inicio-pedido-fila">
                    <div className="inicio-pedido-info">
                      <span className="inicio-pedido-codigo">
                        #{pedido.codigo || pedido.id}
                      </span>
                      <span>{resumenProducto}</span>
                    </div>

                    <div className="inicio-pedido-derecha">
                      <span className="inicio-pedido-total">
                        ${Number(pedido.total || 0).toFixed(0)} MXN
                      </span>
                      <ChipEstado estado={pedido.estado} />
                    </div>
                  </div>
                );
                })}
               </div>
                )}

          <Link to="/mis-pedidos" className="inicio-link-todos">
            Ver todos mis pedidos
          </Link>
        </section>
        </main>
        </div>
  );
}