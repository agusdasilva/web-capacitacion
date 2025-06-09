export interface Video {
    id: number;
    titulo: string;
    descripcion?: string;
    url: string;
    duracion: number;
    examen_id?: number;
    visible_para_usuario: boolean;
  }