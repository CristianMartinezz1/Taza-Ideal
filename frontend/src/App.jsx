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
import AdminUsuarios from "./paginas/admin/AdminUsuarios";
import AdminPedidos from "./paginas/admin/AdminPedidos";
import AdminProductos from "./paginas/admin/AdminProductos";
import AdminProductoForm from "./paginas/admin/AdminProductoForm";
import AdminCategorias from "./paginas/admin/AdminCategorias";
import AdminCategoriaForm from "./paginas/admin/AdminCategoriaForm";

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

         <Route path="/inicio" element={<RutaProtegida rolesPermitidos={["CLIENTE"]}> <Inicio /></RutaProtegida>  }/>
         <Route path="/encuesta" element={<RutaProtegida rolesPermitidos={["CLIENTE"]}><Encuesta /></RutaProtegida>} />
         <Route path="/resultado" element={<RutaProtegida rolesPermitidos={["CLIENTE"]}><Resultado /></RutaProtegida>} />

         <Route path="/admin/usuarios" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><AdminUsuarios /></RutaProtegida>} />
         <Route path="/admin/pedidos" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><AdminPedidos /></RutaProtegida>} />
         <Route path="/admin/productos" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><AdminProductos /></RutaProtegida>} />
          <Route path="/admin/productos/nuevo" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><AdminProductoForm /></RutaProtegida>} />
          <Route path="/admin/productos/:id" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><AdminProductoForm /></RutaProtegida>} />
         <Route path="/admin/categorias" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><AdminCategorias /></RutaProtegida>} />
          <Route path="/admin/categorias/nueva" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><AdminCategoriaForm /></RutaProtegida>} />
          <Route path="/admin/categorias/:id" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><AdminCategoriaForm /></RutaProtegida>} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
         </BrowserRouter>
        </AuthProvider>
  );
}