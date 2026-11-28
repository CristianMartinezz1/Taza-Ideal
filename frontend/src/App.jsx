import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RutaProtegida from "./componentes/RutaProtegida";
import Login from "./paginas/acceso/Login";
import Registro from "./paginas/acceso/Registro";
import Recuperar from "./paginas/acceso/Recuperar";
import VerificarCorreo from "./paginas/acceso/VerificarCorreo";
import Terminos from "./paginas/acceso/Terminos";
import Inicio from "./paginas/cliente/Inicio";
import Encuesta from "./paginas/cliente/Encuesta";
import Resultado from "./paginas/cliente/Resultado";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar" element={<Recuperar />} />
          <Route path="/verificar" element={<VerificarCorreo />} />
          <Route path="/verificar-correo" element={<VerificarCorreo />} />
          <Route path="/terminos" element={<Terminos />} />

          {/* Grupo 2: Cliente - Inicio y Encuesta */}
         <Route path="/inicio" element={<RutaProtegida rolesPermitidos={["CLIENTE"]}> <Inicio /></RutaProtegida>  }/>
         <Route path="/encuesta" element={<RutaProtegida rolesPermitidos={["CLIENTE"]}><Encuesta /></RutaProtegida>} />
         <Route path="/resultado" element={<RutaProtegida rolesPermitidos={["CLIENTE"]}><Resultado /></RutaProtegida>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}