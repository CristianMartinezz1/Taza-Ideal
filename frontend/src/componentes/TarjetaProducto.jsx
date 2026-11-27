import Boton from "./Boton";

export default function TarjetaProducto({ producto, alAgregar }) {
  return (
    <div className="bg-white rounded-xl border border-chocolate/15 overflow-hidden flex flex-col justify-between shadow-xs">
     <div>
     <div className="h-36 bg-crema-oscura overflow-hidden">
       {producto.imagen ? (
        <img
        src={producto.imagen}
       alt={producto.nombre}
         className="w-full h-full object-cover"
        />
          ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-chocolate/50">
         Sin foto
        </div>
          )}
        </div>

        <div className="p-4">
         <div className="flex items-start justify-between gap-2 mb-1">
         <h3 className="font-bold text-sm text-chocolate">{producto.nombre}</h3>
         <span className="text-xs font-bold text-verde-azulado">
           ${Number(producto.precio).toFixed(2)}
         </span>
          </div>
          <p className="text-xs text-chocolate/70 line-clamp-2">{producto.descripcion}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <Boton
          variante="cafe"
          className="w-full"
          onClick={() => alAgregar && alAgregar(producto)}
        >
          Agregar
        </Boton>
      </div>
    </div>
  );
}