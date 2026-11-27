import { Link, NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import "./componentes.css";

export default function Navbar({ usuario, alCerrarSesion }) {
  const rol = (usuario?.rol || "").toUpperCase();

  const enlacesPorRol = {
    CLIENTE:[
      { to: "/inicio", texto: "Inicio" },
      { to: "/encuesta", texto: "Encuesta" },
      { to: "/menu", texto: "Menú" },
      { to: "/carrito", texto: "Carrito" },
      { to: "/mis-pedidos", texto: "Mis pedidos" },
    ],
    BARISTA:[
      { to: "/barista/pedidos", texto: "Pedidos del día" },
    ],
    ADMIN:[
      { to: "/admin/usuarios", texto: "Usuarios" },
      { to: "/admin/productos", texto: "Productos" },
      { to: "/admin/categorias", texto: "Categorías" },
      { to: "/admin/pedidos", texto: "Pedidos" },
    ],
  };

  const enlaces = enlacesPorRol[rol] || [
    { to: "/menu", texto: "Menú" },
  ];

  return(
    <header className="navbar">
      <div className="navbar-contenedor">
        <Link to={usuario ? enlaces[0]?.to || "/" : "/"} className="navbar-marca">
          <img src="/tazalogo.svg" alt="Taza Ideal" />
          <span>Taza Ideal</span>
        </Link>

        <nav className="navbar-enlaces">
          {enlaces.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `navbar-enlace ${isActive ? "activo" : ""}`.trim()
              }
            >
              {item.texto}
            </NavLink>
          ))}
        </nav>

        {usuario ? (
          <div className="navbar-usuario">
          <div className="navbar-datos">
          <span className="navbar-nombre">{usuario.nombre}</span>
          <span className="navbar-correo">{usuario.correo}</span>
          </div>

          <Link to="/perfil" title="Ir a mi perfil">
          <Avatar nombre={usuario.nombre} url={usuario.avatar} tamano={36} />
          </Link>

          <Link to="/perfil" className="navbar-enlace">
          Perfil
        </Link>
            <button
              type="button"
              onClick={alCerrarSesion}
              className="navbar-btn-salir"
            >
              Cerrar sesión
            </button>
            </div>
        ) : (
          <div className="navbar-enlaces">
            <NavLink to="/login" className="navbar-enlace">
              Iniciar sesión
            </NavLink>
            <NavLink to="/registro" className="navbar-enlace">
              Registrarse
            </NavLink>
          </div>
        )}
        </div>
        </header>
  );
  }