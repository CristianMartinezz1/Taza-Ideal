import "./componentes.css";

export default function Avatar({ nombre = "Usuario", url = "", tamano = 36 }) {
  const iniciales = nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || "")
    .join("");

  const estilo = {
    width: `${tamano}px`,
    height: `${tamano}px`,
    fontSize: `${Math.round(tamano * 0.4)}px`,
  };

  return(
    <div className="avatar" style={estilo} title={nombre}>
     {url ? (
    <img src={url} alt={nombre} />
      ) : (
        <span>{iniciales || "U"}</span>
      )}
</div>
  );
}