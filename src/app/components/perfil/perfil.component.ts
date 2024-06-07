import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion } from 'src/app/interfaces/publicacion';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
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
  esMiPerfil!: boolean;
  nicknameLogeado: string = '';

  ngOnInit(): void {
    this.getUserId();
    this.obtenerUrlActual();
  }

  getUserId(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.idUsuario = parseInt(userId, 10);
      // Obtener el nickname del usuario logeado si hay un usuario logeado
      if (this.authService.isLoggedIn()) {
        this.authService.getUserById(this.idUsuario).subscribe(
          (data: Usuario) => {
            this.nicknameLogeado = data.nickname;
            // Suscribirse a los cambios de ruta después de obtener el nickname del usuario logeado
            this.subscribeToRouteChanges();
          },
          (error: any) => {
            console.error("Error al obtener los datos de usuario", error);
          }
        );
      }
    } else {
      console.error('User ID is null');
    }
  }

  subscribeToRouteChanges(): void {
    this.route.paramMap.subscribe(params => {
      const nickname = params.get('nickname');
      if (nickname) {
        this.cargarUsuarioPorNickname(nickname);
      } else {
        this.cargarUsuario();
      }
      this.isAdmin();
    });
  }

  cargarUsuario(): void {
    if (this.idUsuario) {
      this.authService.getUserById(this.idUsuario).subscribe(
        (data: Usuario) => {
          this.usuario = data;
          this.esMiPerfil = this.nicknameLogeado === this.usuario.nickname;
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
        this.esMiPerfil = this.nicknameLogeado === nickname;
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

  estaEnPerfilAdmin(): boolean {
    return this.urlActual === '/perfil/admin';
  }

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

  async generaInformePublicaciones() {
    try {
      const publicaciones = await this.publicacionService.obtenerPublicaciones().toPromise();

      if (publicaciones) {
        const data = publicaciones.map(publicacion => ({
          Titulo: publicacion.titulo,
          Contenido: publicacion.contenido,
          Fecha: publicacion.fecha_creacion,
          Usuario: publicacion.usuario.nickname
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        ws['!cols'] = [
          { wch: 20 },
          { wch: 10 },
          { wch: 20 },
        ];
        ws['A1'] = { v: 'Título', t: 's' };
        ws['B1'] = { v: 'Contenido', t: 's' };
        ws['C1'] = { v: 'Fecha', t: 's' };
        ws['E1'] = { v: 'Usuario', t: 's' };

        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const blobUrl = URL.createObjectURL(blob);

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

  obtenerSeguidos(usuario: Usuario): void {
    this.usuarioService.obtenerSeguidosPorUsuario(usuario.id)
      .subscribe(
        seguidos => {
          console.log('Seguidos:', seguidos);
          this.router.navigate([`/perfil/${usuario.nickname}/seguidos`], {
            state: { seguidos: seguidos }
          });
        },
        error => {
          console.error('Error al obtener los seguidos:', error);
        }
      );
  }

  obtenerSeguidores(usuario: Usuario): void {
    this.usuarioService.obtenerSeguidoresPorUsuario(usuario.id)
      .subscribe(
        seguidores => {
          console.log('Seguidores:', seguidores);
          this.router.navigate([`/perfil/${usuario.nickname}/seguidores`], {
            state: { seguidores: seguidores }
          });
        },
        error => {
          console.error('Error al obtener los seguidores:', error);
        }
      );
  }

  obtenerPublicaciones(usuario: Usuario): void {
    this.publicacionService.obtenerPublicacionesPorNickname(usuario.nickname)
      .subscribe(
        publicaciones => {
          console.log('Publicaciones:', publicaciones);
          this.router.navigate([`/perfil/${usuario.nickname}/publicaciones`], {
            state: { publicaciones: publicaciones }
          });
        },
        error => {
          console.error('Error al obtener las publicaciones:', error);
        }
      );
  }

  async eliminarUsuario(id: number) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará tu cuenta y no se podrá deshacer más tarde.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          console.log('Usuario con id ' + id + ' eliminado con exito');
          this.authService.logout();
          this.router.navigate(['main'])
        },
        error: (error) => {
          console.log('Hubo un error al eliminar el usuario');
        }
      });
    }
  }
}
