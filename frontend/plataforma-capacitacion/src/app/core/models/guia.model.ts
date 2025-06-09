export interface Guia {
    id: number;
    titulo: string;
    descripcion?: string;
    archivo: string;
    examen_id?: number;
    visible_para_usuario: boolean;
  }