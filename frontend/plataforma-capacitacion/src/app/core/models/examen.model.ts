export interface Examen {
    id: number;
    titulo: string;
    descripcion?: string;
    duracion_total: number;
    archivo_adjunto?: string;
    visible_para_usuario: boolean;
  }