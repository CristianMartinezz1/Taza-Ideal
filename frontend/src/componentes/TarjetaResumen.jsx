export default function TarjetaResumen({ titulo, valor, colorTexto = "text-chocolate" }) {
  return (
    <div className="bg-white rounded-xl border border-chocolate/15 p-4">
    <p className="text-xs text-chocolate/70 mb-1">{titulo}</p>
    <p className={`text-2xl font-bold ${colorTexto}`}>{valor}</p>
    </div>
  );
}