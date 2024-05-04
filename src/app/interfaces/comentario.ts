import { Publicacion } from "./publicacion";
import { Usuario } from "./usuario";

export interface Comentario {
    id:number;
    comentario:string;
    fecha_creacion:Date;
    publicacion:Publicacion;
    usuario:Usuario;
    usuarioid?:string;
    publicacionId?:number;
}
