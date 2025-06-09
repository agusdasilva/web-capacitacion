export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    rol: 'admin' | 'vendedor' | 'supervisor';
    foto_perfil?: string;
    tema_ui?: 'claro' | 'oscuro';
    ultima_conexion: string;
    fecha_registro: string;
    activo: boolean;
}
