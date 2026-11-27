import "./componentes.css";

export default function Boton({  children,tipo = "button",
  variante = "primario", // primario | secundario | peligro | acento
  onClick,
  deshabilitado = false,
  className = "",
}) {
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={deshabilitado}
      className={`btn btn-${variante} ${className}`.trim()}
  >
      {children}
</button>
);
}