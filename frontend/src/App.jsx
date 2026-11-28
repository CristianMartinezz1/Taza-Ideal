import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./paginas/acceso/Login";
import Registro from "./paginas/acceso/Registro";
import Recuperar from "./paginas/acceso/Recuperar";
import VerificarCorreo from "./paginas/acceso/VerificarCorreo";
import Terminos from "./paginas/acceso/Terminos";


export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div style={{ padding: "2rem" }}>Pantalla siguiente</div>} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar" element={<Recuperar />} />
          <Route path="/verificar" element={<VerificarCorreo />} />
          <Route path="/verificar-correo" element={<VerificarCorreo />} />
          <Route path="/terminos" element={<Terminos />} />
        </Routes>
   </BrowserRouter>
    </AuthProvider>
  );
}