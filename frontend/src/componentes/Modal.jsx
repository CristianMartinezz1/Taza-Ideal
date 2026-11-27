import Boton from "./Boton";
import "./componentes.css";

export default function Modal({abierto,titulo,mensaje,children,textoConfirmar = "Confirmar",
  varianteConfirmar = "primario", // primario | peligro | acento
  alCerrar,alConfirmar,cargando = false,}) {
  if (!abierto) return null;

  return (
    <div className="modal-fondo" onClick={alCerrar}>
      <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
        {titulo && <h3 className="modal-titulo">{titulo}</h3>}
        {mensaje && <p className="modal-mensaje">{mensaje}</p>}
        {children}

        {alConfirmar && (
        <div className="modal-acciones">
        <Boton variante="secundario" onClick={alCerrar} deshabilitado={cargando}>
              Cancelar
        </Boton>
        <Boton
         variante={varianteConfirmar}
        onClick={alConfirmar}
         deshabilitado={cargando}
            >
       {cargando ? "Procesando..." : textoConfirmar}
       </Boton>
       </div>
        )}
      </div>
    </div>
  );
}