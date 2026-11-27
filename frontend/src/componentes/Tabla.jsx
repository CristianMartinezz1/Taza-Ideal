import Paginacion from "./Paginacion";
import "./componentes.css";

export default function Tabla({  columnas = [],  datos = [],  renderFila,  paginaActual = 0,  totalPaginas = 1,alCambiarPagina,mensajeVacio = "No hay registros para mostrar.",}) {
  return(
    <div className="tabla-contenedor">
    <div className="tabla-scroll">
    <table className="tabla">
    <thead>
    <tr>
         {columnas.map((col, idx) => (
                <th key={idx}>{col.titulo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datos.length === 0 ? (
              <tr>
                <td colSpan={columnas.length} className="tabla-vacia">
                  {mensajeVacio}
                </td>
              </tr>
            ) : (
              datos.map((fila, idx) =>
                renderFila ? (
                renderFila(fila, idx)
            ) : (
              <tr key={idx}>
                {columnas.map((col, cIdx) => (
                      <td key={cIdx}>{fila[col.campo]}</td>
                    ))}
                  </tr>
                )
              )
            )}
          </tbody>
         </table>
         </div>

      {alCambiarPagina && (
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          alCambiarPagina={alCambiarPagina}
        />
      )}
    </div>
  );
}