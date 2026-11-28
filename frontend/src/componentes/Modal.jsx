import Boton from "./Boton";
import "./componentes.css";

export default function Modal({abierto,titulo,mensaje,children,textoConfirmar = "Confirmar",
  varianteConfirmar = "primario", // primario | peligro | acento
  alCerrar,alCancelar,alConfirmar,cargando = false,}) {
  if (!abierto) return null;

  // Las pantallas usan alCancelar o alCerrar: cualquiera de los dos cierra el modal
  const cerrar = alCerrar || alCancelar;

  return (
    <div className="modal-fondo" onClick={cerrar}>
      <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
        {titulo && <h3 className="modal-titulo">{titulo}</h3>}
        {mensaje && <p className="modal-mensaje">{mensaje}</p>}
        {children}

        {alConfirmar && (
        <div className="modal-acciones">
        <Boton variante="secundario" onClick={cerrar} deshabilitado={cargando}>
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