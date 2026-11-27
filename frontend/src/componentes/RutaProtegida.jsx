import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RutaProtegida({ children, rolesPermitidos = [] }) {
  const { usuario, token } = useContext(AuthContext);

  //no ha iniciado sesión, lo mandamos al login
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta pide un rol específico y el usuario tiene otro, lo mandamos a su pantalla principal
if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol)) {
if (usuario.rol === "ADMIN") return <Navigate to="/admin/usuarios" replace />;
if (usuario.rol === "BARISTA") return <Navigate to="/barista/pedidos" replace />;
return <Navigate to="/inicio" replace />;
 }

 return children;
}