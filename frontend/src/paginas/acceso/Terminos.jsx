import { Link, useNavigate } from "react-router-dom";
import Boton from "../../componentes/Boton";
import Logo from "../../componentes/Logo";
import "./acceso.css";

export default function Terminos() {
  const navigate = useNavigate();

  return (
    <div className="acceso-contenedor">
      {/* Lado izquierdo café */}
         <aside className="acceso-marca">
        <div className="acceso-marca-caja">
          <div className="acceso-logo-circulo">
            <Logo tamano={105} />
          </div>
          <h1>Taza ideal</h1>
          <p className="acceso-subtitulo">El café que te entiende</p>
          <p className="acceso-descripcion">
            Responde 6 preguntas y te recomendamos la bebida de nuestro menú que
            mejor va con tu gusto. Pídela en línea y recógela sin filas.
          </p>
        </div>
        </aside>

      {/* Lado derecho crema */}
      <main
        className="acceso-lado-form"
        style={{ backgroundImage: "none", backgroundColor: "var(--crema)" }}
      >
        <div className="acceso-tarjeta" style={{ maxWidth: "28rem" }}>
          <h2>Términos y privacidad</h2>
          <p className="acceso-tarjeta-sub">
            Última actualización: 25 de noviembre de 2026
          </p>

            <div
            style={{
              textAlign: "left",
              fontSize: "0.8rem",
              color: "var(--chocolate)",
              lineHeight: 1.55,
              marginBottom: "1.25rem",
            }}
          >
              <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                margin: "0 0 0.35rem",
              }}
            >
              Términos
              </h3>
              <ul style={{ margin: "0 0 1rem", paddingLeft: "1.1rem" }}>
              <li>Para pedir necesitas una cuenta con correo verificado.</li>
              <li>Puedes cancelar un pedido mientras esté "Recibido".</li>
              <li>
                Te avisamos por correo, SMS y WhatsApp cuando tu pedido está
                listo.
              </li>
              <li>El pago se realiza al recoger el pedido.</li>
            </ul>

            <h3
             style={{
          fontSize: "0.85rem",
         fontWeight: 700,
            margin: "0 0 0.35rem",
              }}
            >
              Privacidad
             </h3>
              <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
              <li>
                Usamos tu nombre, correo y teléfono solo para gestionar tus
                pedidos y avisos.
              </li>
              <li>
                Tu contraseña se guarda cifrada; nadie del equipo puede verla.
              </li>
              <li>Puedes editar o eliminar tu cuenta desde tu perfil.</li>
              <li>Dudas: contacto@tazaideal.online</li>
            </ul>
            </div>

           <Boton
            tipo="button"
            variante="primario"
            onClick={() => navigate("/registro")}
            className="acceso-btn-lleno"
          >
            Volver al registro
          </Boton>

           <p className="acceso-pie" style={{ textAlign: "left" }}>
            <Link to="/login" className="acceso-link">
              Ir a iniciar sesión
            </Link>
          </p>
        </div>
        </main>
        </div>
  );
}