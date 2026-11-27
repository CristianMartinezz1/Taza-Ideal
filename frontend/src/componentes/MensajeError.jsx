import Boton from "./Boton";
import "./componentes.css";

export default function MensajeError({mensaje = "No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.",alReintentar,}) {
  return(
<div className="error-caja" role="alert">
<p className="error-titulo">Error de conexión</p>
 <p className="error-detalle">{mensaje}</p>
    {alReintentar && (
    <Boton variante="primario" onClick={alReintentar}>
              Reintentar
    </Boton>
      )}
    </div>
  );
}