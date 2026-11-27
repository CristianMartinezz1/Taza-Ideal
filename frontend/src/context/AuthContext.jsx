import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // al cargar la página, revisamos si ya había una sesión guardada en el navegador
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  // guarda la sesión cuando el login sale bien
  function login(datosUsuario, nuevoToken) {
    localStorage.setItem("token", nuevoToken);
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    setToken(nuevoToken);
    setUsuario(datosUsuario);
  }

  // borra todo al cerrar sesión
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken("");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}