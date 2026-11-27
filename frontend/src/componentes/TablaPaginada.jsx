export default function TablaPaginada({
  columnas = [], // [{ titulo: "Pedido", campo: "id" }]
  datos = [],
  renderFila, // función opcional para personalizar celdas
  paginaActual = 0,
  totalPaginas = 1,
  alCambiarPagina,
  mensajeVacio = "No hay registros para mostrar.",
}) {
  return (
    <div className="bg-white rounded-xl border border-chocolate/15 overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
       <thead>
         <tr className="bg-crema-oscura/70 border-b border-chocolate/15 text-xs font-bold text-chocolate">
       {columnas.map((col, idx) => (
        <th key={idx} className="py-3 px-4">
           {col.titulo}
           </th>
          ))}
        </tr>
          </thead>
          <tbody className="divide-y divide-chocolate/10 text-xs text-chocolate">
            {datos.length === 0 ? (
              <tr>
           <td colSpan={columnas.length} className="py-8 text-center text-chocolate/60">
             {mensajeVacio}
              </td>
              </tr>
            ) : (
              datos.map((fila, idx) =>
                renderFila ? (
                  renderFila(fila, idx)
                ) : (
                  <tr key={idx} className="hover:bg-crema/50">
                    {columnas.map((col, cIdx) => (
                      <td key={cIdx} className="py-3 px-4">
                     {fila[col.campo]}
                      </td>
             ))}
             </tr>
            )
          )
         )}
          </tbody>
        </table>
      </div>

      {/* Paginación del lado del servidor */}
      <div className="px-4 py-3 border-t border-chocolate/10 flex items-center justify-between text-xs text-chocolate/75 bg-crema/30">
        <span>
          Página {paginaActual + 1} de {Math.max(totalPaginas, 1)}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={paginaActual === 0}
            onClick={() => alCambiarPagina && alCambiarPagina(paginaActual - 1)}
            className="px-2.5 py-1 rounded border border-chocolate/20 bg-white disabled:opacity-40 cursor-pointer"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={paginaActual + 1 >= totalPaginas}
            onClick={() => alCambiarPagina && alCambiarPagina(paginaActual + 1)}
            className="px-2.5 py-1 rounded border border-chocolate/20 bg-white disabled:opacity-40 cursor-pointer"
          >
            Siguiente
 </button>
    </div>
 </div>
 </div>
  );
}