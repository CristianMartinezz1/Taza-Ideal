import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import cliente from "../../api/cliente";
import Navbar from "../../componentes/Navbar";
import Boton from "../../componentes/Boton";
import Cargando from "../../componentes/Cargando";
import MensajeError from "../../componentes/MensajeError";
import "./cliente.css";

const PREGUNTAS = [
  {
    id: 1,
    clave: "temperatura",
    texto: "¿Cómo prefieres tu bebida?",
    opciones: [
      { valor: "caliente", etiqueta: "Caliente" },
      { valor: "fria", etiqueta: "Fría" },
    ],
  },
  {
    id: 2,
    clave: "sabor",
    texto: "¿Qué perfil de sabor disfrutas más?",
    opciones: [
      { valor: "dulce", etiqueta: "Dulce" },
      { valor: "equilibrado", etiqueta: "Equilibrado" },
      { valor: "amargo", etiqueta: "Amargo" },
      { valor: "especiado", etiqueta: "Especiado" },
    ],
  },
  {
    id: 3,
    clave: "leche",
    texto: "¿La prefieres con leche?",
    opciones: [
      { valor: "si", etiqueta: "Sí, con leche" },
      { valor: "no", etiqueta: "No, sin leche" },
    ],
  },
  {
    id: 4,
    clave: "intensidad",
    texto: "¿Qué intensidad de café prefieres?",
    opciones: [
      { valor: "suave", etiqueta: "Suave" },
      { valor: "media", etiqueta: "Media" },
      { valor: "fuerte", etiqueta: "Fuerte" },
    ],
  },
  {
    id: 5,
    clave: "chocolate",
    texto: "¿Te gustaría que tenga notas de chocolate?",
    opciones: [
      { valor: "si", etiqueta: "Sí, me encanta" },
      { valor: "no", etiqueta: "No, sin chocolate" },
    ],
  },
  {
    id: 6,
    clave: "momento",
    texto: "¿Para qué momento del día es tu bebida?",
    opciones: [
      { valor: "manana", etiqueta: "Por la mañana" },
      { valor: "tarde", etiqueta: "Por la tarde" },
      { valor: "noche", etiqueta: "Por la noche" },
    ],
  },
];

export default function Encuesta() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [errorSeleccion, setErrorSeleccion] = useState("");
  const [calculando, setCalculando] = useState(false);
  const [errorApi, setErrorApi] = useState("");

  const preguntaActual = PREGUNTAS[indice];
  const respuestaActual = respuestas[preguntaActual.clave] || "";
  const porcentaje = Math.round(((indice + 1) / PREGUNTAS.length) * 100);

  const manejarCerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  const seleccionarOpcion = (valor) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaActual.clave]: valor,
    }));
    setErrorSeleccion("");
  };

  const manejarAtras = () => {
    setErrorSeleccion("");
    if (indice === 0) {
      navigate("/inicio");
    } else {
      setIndice((prev) => prev - 1);
    }
  };

  const manejarSiguiente = async () => {
    if (!respuestaActual) {
      setErrorSeleccion("Selecciona una opción para continuar.");
      return;
    }

    if (indice < PREGUNTAS.length - 1) {
      setIndice((prev) => prev + 1);
      return;
    }

    setCalculando(true);
    setErrorApi("");
    try {
      const payload = {
        temperatura: respuestas.temperatura,
        sabor: respuestas.sabor,
        leche: respuestas.leche,
        intensidad: respuestas.intensidad,
        chocolate: respuestas.chocolate,
        momento: respuestas.momento,
      };
      const { data } = await cliente.post("/encuesta", payload);
      navigate("/resultado", { state: { resultado: data } });
    } catch (err) {
      setErrorApi(
        err.mensaje || "No pudimos calcular tu recomendación. Intenta de nuevo."
      );
      setCalculando(false);
    }
  };

  return (
    <div className="cliente-pagina">
      <Navbar usuario={usuario} alCerrarSesion={manejarCerrarSesion} />

      <main className="encuesta-contenedor">
        {calculando ? (
          <Cargando texto="Analizando tus gustos y buscando tu taza ideal..." />
        ) : errorApi ? (
          <MensajeError
            titulo="Error al procesar la encuesta"
            detalle={errorApi}
            alReintentar={manejarSiguiente}
          />
        ) : (
          <section className="encuesta-tarjeta">
            <div className="encuesta-progreso-info">
              <span>
                Pregunta {indice + 1} de {PREGUNTAS.length}
              </span>
              <span>{porcentaje}%</span>
            </div>

            <div className="encuesta-barra-fondo">
              <div
                className="encuesta-barra-relleno"
                style={{ width: `${porcentaje}%` }}
              />
            </div>

            <h1 className="encuesta-pregunta">{preguntaActual.texto}</h1>

            <div className="encuesta-opciones" role="radiogroup">
              {preguntaActual.opciones.map((op) => {
                const activa = respuestaActual === op.valor;
                return (
                  <button
                    key={op.valor}
                    type="button"
                    role="radio"
                    aria-checked={activa}
                    className={`encuesta-opcion ${activa ? "seleccionada" : ""}`.trim()}
                    onClick={() => seleccionarOpcion(op.valor)}
                  >
                    <span className="encuesta-radio">
                      {activa && <span className="encuesta-radio-punto" />}
                    </span>
                    <span>{op.etiqueta}</span>
                  </button>
                );
              })}
            </div>

            {errorSeleccion && (
              <p className="encuesta-error">{errorSeleccion}</p>
            )}

            <div className="encuesta-acciones">
              <Boton variante="secundario" onClick={manejarAtras}>
                Atrás
              </Boton>

              <Boton variante="primario" onClick={manejarSiguiente}>
                {indice === PREGUNTAS.length - 1
                  ? "Ver mi recomendación"
                  : "Siguiente"}
              </Boton>
            </div>
          </section>
        )}
         </main>
        </div>
  );
}