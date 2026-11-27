import Boton from "./Boton";

export function EstadoCargando({ texto = "Cargando información..." }) {
  return (
    <div className="bg-white rounded-xl border border-chocolate/15 p-10 text-center my-4">
    <div className="w-8 h-8 border-4 border-crema-oscura border-t-cafe rounded-full animate-spin mx-auto mb-3"></div>
     <p className="text-sm text-chocolate/75">{texto}</p>
    </div> );
}

export function EstadoErrorRed({
  mensaje = "No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.",
  alReintentar,
}) {
  return (
    <div className="bg-red-50 rounded-xl border border-rojo/30 p-8 text-center my-4">
      <p className="text-sm font-bold text-rojo mb-1">Error de conexión</p>
      <p className="text-xs text-chocolate/80 mb-4">{mensaje}</p>
      {alReintentar && (
     <Boton variante="cafe" onClick={alReintentar}>
          Reintentar
     </Boton>
    )}
    </div>
     );
     }