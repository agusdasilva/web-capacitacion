export interface Pregunta {
    id: number;
    examen_id: number;
    texto: string;
    opciones: string[];
    respuesta_correcta: string;
    tiempo_maximo?: number;
  }