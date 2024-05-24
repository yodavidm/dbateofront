import { Categoria } from "./categoria";
import { Usuario } from "./usuario";
import { Comentario } from "./comentario";

export interface Publicacion {
    id:number;
    titulo: string;
    contenido: string;
    fecha_creacion: Date;
    usuario: Usuario; 
    categoria:Categoria;
    comentario?:Comentario;
    estaSiguiendo?: boolean;

}
