import "./componentes.css";

export default function ChipEstado({ estado }) {
  const mapaClases = {
  PENDIENTE: "chip-pendiente",
  "EN PREPARACIÓN": "chip-en-preparacion",
  "EN PREPARACION": "chip-en-preparacion",
  LISTO: "chip-listo",
  ENTREGADO: "chip-entregado",
  CANCELADO: "chip-cancelado",
  ACTIVO: "chip-activo",
  INACTIVO: "chip-inactivo",
  };

  const clave =(estado || "").toUpperCase();
  const claseEstado = mapaClases[clave] || "";

  return(
  <span className={`chip ${claseEstado}`.trim()}>
  {estado}
  </span>
  );
}