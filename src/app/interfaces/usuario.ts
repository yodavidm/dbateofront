import { Rol } from "./rol";
import { SeguidorDTO } from "./seguidor";

export interface Usuario {
    id: number;
    nickname: string;
    email:string;
    fechaRegistro:Date;
    rol:Rol
    seguidores:SeguidorDTO[];
}
