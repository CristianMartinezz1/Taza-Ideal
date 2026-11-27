import "./componentes.css";

export default function Cargando({ texto = "Cargando..." }) {
return(
<div className="estado-caja" role="status">
<div className="spinner" />
<p className="estado-texto">{texto}</p>
</div>
  );
}