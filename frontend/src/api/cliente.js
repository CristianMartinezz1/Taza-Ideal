import axios from "axios";

const cliente = axios.create({
  baseURL: "/api",
});

// Agrega el token JWT automáticamente en cada petición
cliente.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Convierte errores del backend en mensajes claros; si llega 401 cierra sesión
cliente.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if(status === 401 && !error.config?.url?.includes("/auth/login")) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
    }

    const errorNormalizado = {
    estado: status || 0,
    mensaje:
      data?.mensaje ||
      (status === 0 || !error.response
        ? "No pudimos conectar con el servidor. Revisa tu conexión."
        : "Ocurrió un error inesperado."),
    errores: data?.errores || {},
    };

  return Promise.reject(errorNormalizado);
  }
  );
export default cliente;