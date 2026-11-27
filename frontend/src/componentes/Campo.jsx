import "./componentes.css";

export default function Campo({etiqueta,tipo = "text",nombre,valor,onChange,placeholder = "",error = "",ayuda = "",requerido = false,}) {
  return (
    <div className="campo-grupo">
    {etiqueta && (
    <label htmlFor={nombre} className="campo-etiqueta">
   {etiqueta} {requerido && <span className="campo-requerido">*</span>}
    </label>
     )}

      <input
      id={nombre}
      type={tipo}
      name={nombre}
      value={valor}
      onChange={onChange}
      placeholder={placeholder}
      className={`campo-input ${error ? "campo-input-error" : ""}`.trim()}
         />

      {error ? (
        <p className="campo-mensaje-error">{error}</p>
      ) : (
        ayuda && <p className="campo-ayuda">{ayuda}</p>    )}
  </div>
  );
}