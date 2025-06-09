export interface Foro {
    id: number;
    titulo: string;
    mensaje: string;
    imagen?: string;
    autor_id: number;
    fecha: string;
    habilitado_respuestas: boolean;
  }
  