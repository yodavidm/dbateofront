import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-usuarios',
  templateUrl: './ver-usuarios.component.html',
  styleUrls: ['./ver-usuarios.component.css']
})
export class VerUsuariosComponent implements OnInit {

  constructor(private usuarioService: UsuarioService, private router: Router, private route: ActivatedRoute) { }

  usuarios!: Usuario[];
  page!: number;

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.obtenerTodosLosUsuarios().subscribe({
      next: (usuario: Usuario[]) => {
        this.usuarios = usuario;
        console.log("Usuarios obtenidos ", this.usuarios);
      },
      error: error => {
        console.log("Error al obtener usuarios", error);

      }
    })
  }

  cambiarPagina(nuevaPagina: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: nuevaPagina },
      queryParamsHandling: 'merge', // Mantener otros parámetros de la URL
    });
  }

  async eliminarUsuario(id: number) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el usuario y no se podrá deshacer más tarde.",
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
          window.location.reload();
        },
        error: (error) => {
          console.log('Hubo un error al eliminar el usuario');

        }
      });
    }
  }


}
