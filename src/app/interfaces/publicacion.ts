import { Categoria } from "./categoria";
import { Usuario } from "./usuario";

export interface Publicacion {
    id:number;
    titulo: string;
    contenido: string;
    fecha_creacion: Date;
    id_categoria?: number;
    id_usuario: number; //RECORDAR QUITAR SETEO AUTOMATICO DE ID USUARIO
    usuario: Usuario; // Objeto completo de Usuario
    categoria:Categoria;
}
