export default function Logo({ tamano = 68, invertido = false }) {
  const fondo = invertido ? "var(--cafe)" : "var(--crema)";
  const taza = invertido ? "var(--crema)" : "var(--cafe)";

  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Taza Ideal"
    >
      {/* Círculo */}
      <circle cx="75" cy="75" r="75" fill={fondo} />

      {/* Tres hilos de vapor */}
      <path
        d="M52 52C52 46 56 43 56 37"
        stroke={taza}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M73 52C73 46 77 43 77 37"
        stroke={taza}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M94 52C94 46 98 43 98 37"
        stroke={taza}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Taza */}
      <path
        d="M44 66H98V88C98 100.15 88.15 110 76 110H66C53.85 110 44 100.15 44 88V66Z"
        fill={taza}
      />

      {/* Asa de la taza */}
      <path
        d="M98 72H106C111.523 72 116 76.4772 116 82C116 87.5228 111.523 92 106 92H98"
        stroke={taza}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}