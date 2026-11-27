export default function Logo({ oscuro = false }) {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Círculo con la taza */}
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
          oscuro ? "bg-cafe text-crema" : "bg-crema text-cafe"
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          {/* Tres hilos de vapor */}
          <path d="M8 3c0 1.2-1 1.8-1 3s1 1.8 1 3M12 2c0 1.2-1 1.8-1 3s1 1.8 1 3M16 3c0 1.2-1 1.8-1 3s1 1.8 1 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* Taza */}
          <path d="M5 11h11v4a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5v-4zm11 1h2a2 2 0 0 1 0 4h-2v-4z" />
        </svg>
      </div>

      <div>
        <h1 className={`font-bold text-lg leading-tight ${oscuro ? "text-chocolate" : "text-crema"}`}>
          Taza ideal
        </h1>
        <p className={`text-xs ${oscuro ? "text-verde-azulado" : "text-crema-oscura/80"}`}>
          El café que te entiende
        </p>
      </div>
    </div>
  );
}