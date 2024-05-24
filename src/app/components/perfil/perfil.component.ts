import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion } from 'src/app/interfaces/publicacion';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(private authService: AuthService, private route: ActivatedRoute, private usuarioService: UsuarioService, private router: Router, private publicacionService: PublicacionService) { }

  idUsuario!: number;
  usuario!: Usuario;
  usuarios!: Usuario[];
  esAdmin: boolean = false;
  urlActual!: string;
  publicaciones!: Publicacion[];
  seguidos: any[] = [];
  seguidores: any[] = [];
  

  ngOnInit(): void {
    this.getUserId();
    this.route.paramMap.subscribe(params => {
      const nickname = params.get('nickname');
      if (nickname) {
        this.cargarUsuarioPorNickname(nickname);

      } else {
        this.cargarUsuario();
        
      }
      this.isAdmin();
    });
    this.obtenerUrlActual();
  }
  

  getUserId(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.idUsuario = parseInt(userId, 10);
    } else {
      console.error('User ID is null');
    }
  }

  cargarUsuario(): void {
    if (this.idUsuario) {
      this.authService.getUserById(this.idUsuario).subscribe(
        (data: Usuario) => {
          this.usuario = data;
        },
        (error: any) => {
          console.error("Error al obtener los datos de usuario", error);
        }
      );
    }
  }

  cargarUsuarioPorNickname(nickname: string): void {
    this.authService.getUserByNickname(nickname).subscribe(
      (data: Usuario) => {
        this.usuario = data;
      },
      (error: any) => {
        console.error("Error al obtener los datos del usuario", error);
      }
    );
  }

  obtenerTodosLosUsuarios(): void {
    this.usuarioService.obtenerTodosLosUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
        console.log('Usuarios cargados', this.usuarios);
      },
      (error: any) => {
        console.error('Error al cargar usuarios', error);
      }
    );
  }

  isAdmin(): void {
    if (this.idUsuario) {
      this.authService.getUserById(this.idUsuario).subscribe({
        next: (usuario: Usuario) => {
          if (usuario.rol && usuario.rol.nombreRol === 'ADMIN_ROLE') {
            this.esAdmin = true;
          } else {
            this.esAdmin = false;
          }
        },
        error: (error) => {
          console.error('Error al obtener el usuario', error);
        }
      });
    } else {
      console.error('User ID is undefined');
    }
  }

  obtenerUrlActual(): void {
    this.urlActual = this.router.url;
  }

  // verificar si la ruta es /perfil/admin
  estaEnPerfilAdmin(): boolean {
    return this.urlActual === '/perfil/admin';
  }

  //informe de usuarios
  async generaInformeUsuarios() {
    try {
      const usuarios = await this.usuarioService.obtenerTodosLosUsuarios().toPromise();

      if (usuarios) {
        const data = usuarios.map(usuario => ({
          Nickname: usuario.nickname,
          Email: usuario.email,
          Fecha: usuario.fechaRegistro,
          Rol: usuario.rol.nombreRol
        }));

        const wb = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(data);

        ws['!cols'] = [
          { wch: 20 },
          { wch: 10 },
          { wch: 20 },
        ];
        ws['A1'] = { v: 'Nickname', t: 's' };
        ws['B1'] = { v: 'Email', t: 's' };
        ws['C1'] = { v: 'Fecha Registro', t: 's' };
        ws['D1'] = { v: 'Rol', t: 's' };

        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([wbout], { type: 'application/octet-stream' });

        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'informe_usuarios.xlsx';
        a.click();
      } else {
        console.error('La lista de usuarios está vacía.');
      }
    } catch (error) {
      console.error('Error al generar el informe:', error);
    }
  }

  //informe de publicaciones
  async generaInformePublicaciones() {
    try {
      // obtenemos publicaciones
      const publicaciones = await this.publicacionService.obtenerPublicaciones().toPromise();

      if (publicaciones) {
        //datos a exportar
        const data = publicaciones.map(publicacion => ({
          Titulo: publicacion.titulo,
          Contenido: publicacion.contenido,
          Fecha: publicacion.fecha_creacion,
          Usuario: publicacion.usuario.nickname
        }));

        // crear excel
        const wb = XLSX.utils.book_new();

        // crear hoja excel
        const ws = XLSX.utils.json_to_sheet(data);

        // columnas
        ws['!cols'] = [
          { wch: 20 },
          { wch: 10 },
          { wch: 20 },
        ];
        ws['A1'] = { v: 'Título', t: 's' };
        ws['B1'] = { v: 'Contenido', t: 's' };
        ws['C1'] = { v: 'Fecha', t: 's' };
        ws['E1'] = { v: 'Usuario', t: 's' };

        // agrear a hoja
        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

        // pasar excel a binario
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // crear blob
        const blob = new Blob([wbout], { type: 'application/octet-stream' });

        // url para blob
        const blobUrl = URL.createObjectURL(blob);

        // descarga
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'informe_publicaciones.xlsx';
        a.click();
      } else {
        console.error('La lista de publicaciones está vacía.');
      }
    } catch (error) {
      console.error('Error al generar el informe:', error);
    }
  }


  //lgica para manejar seguidos y seguidores 
  
  obtenerSeguidos(usuario: Usuario): void {
    
    this.usuarioService.obtenerSeguidosPorUsuario(usuario.id)
      .subscribe(
        seguidos => {
          console.log('Seguidos:', seguidos);
        },
        error => {
          console.error('Error al obtener los seguidos:', error);
        }
      );
  }

  obtenerSeguidores(usuario:Usuario):void{
    this.usuarioService.obtenerSeguidoresPorUsuario(usuario.id)
      .subscribe(
        seguidores => {
          console.log('Seguidores:', seguidores);
        },
        error => {
          console.error('Error al obtener los seguidores:', error);
        }
      );
  }
  
  

}
