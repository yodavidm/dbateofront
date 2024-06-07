import { Usuario } from "./usuario";

export interface Notificacion {

    id:number;
    usuario:Usuario;
    mensaje:string;
    fechaCreacion:Date;
    leida:boolean;

}
