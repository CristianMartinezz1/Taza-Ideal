import "./componentes.css";

export default function Paginacion({ paginaActual = 0,totalPaginas = 1,alCambiarPagina,}) {
  return(
    <div className="paginacion-barra">
    <span>
Página {paginaActual + 1} de {Math.max(totalPaginas, 1)}
      </span>

      <div className="paginacion-botones">
    <button
       type="button"
     disabled={paginaActual === 0}
          onClick={() => alCambiarPagina && alCambiarPagina(paginaActual - 1)}
          className="paginacion-btn"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={paginaActual + 1 >= totalPaginas}
          onClick={() => alCambiarPagina && alCambiarPagina(paginaActual + 1)}
          className="paginacion-btn"
        >
          Siguiente
    </button>
      </div>
    </div>
  );
}