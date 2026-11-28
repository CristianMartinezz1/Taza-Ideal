import { useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../componentes/Navbar";
import Boton from "../../componentes/Boton";
import "./cliente.css";

export default function PedidoConfirmado() {
  const { usuario, logout } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const pedido = state?.pedido;

  if (!pedido) {
    return <Navigate to="/menu" replace />;
  }

  const manejarCerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  const formatearHora = (fechaIso) => {
    if (!fechaIso) return "";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const telefonoCliente = pedido.cliente?.telefono || usuario?.telefono || "registrado";

  return (
    <div className="cliente-pagina">
      <Navbar usuario={usuario} alCerrarSesion={manejarCerrarSesion} />

      <main className="cliente-contenedor">
        <section className="confirmado-caja">
          <div className="confirmado-icono">✓</div>

          <h1 className="confirmado-titulo">
            ¡Pedido #{pedido.codigo || pedido.id} confirmado!
          </h1>

          <p className="confirmado-subtitulo">
            Pasa a recogerlo a las {formatearHora(pedido.horaRecogida)}. No necesitas hacer fila.
          </p>

          <p className="confirmado-aviso-titulo">Cómo te avisamos:</p>

          <div className="confirmado-canales">
            <div className="confirmado-canal">
              <span>
                <strong>Correo electrónico</strong> {usuario?.correo}
              </span>
              <span className="confirmado-nota confirmado-nota-enviado">Confirmación enviada · y otro aviso cuando esté listo</span>
            </div>

            <div className="confirmado-canal">
              <span>
                <strong>SMS y WhatsApp</strong> {telefonoCliente}
              </span>
              <span className="confirmado-nota">Cuando tu pedido esté listo</span>
            </div>
          </div>
 
             <div className="confirmado-acciones">
            <Boton
              variante="primario"
              onClick={() => navigate("/mis-pedidos")}
            >
              Ver mis pedidos
            </Boton>

            <Boton
              variante="secundario"
              onClick={() => navigate("/inicio")}
            >
              Volver al inicio
            </Boton>
          </div>
         </section>
         </main>
          </div>
  );
}