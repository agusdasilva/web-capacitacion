export interface Resultado {
    id: number;
    examen_id: number;
    usuario_id: number;
    nota: number;
    tiempo_total: number;
    visible_para_usuario: boolean;
    fecha: string;
  }