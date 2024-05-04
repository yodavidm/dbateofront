import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Publicacion } from 'src/app/interfaces/publicacion';
import { PublicacionService } from 'src/app/services/publicacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private publicacionService: PublicacionService,private route:ActivatedRoute,private router:Router) { }

  publicaciones!: Publicacion[];
  public page!: number;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idCategoria = +params['categoria']; // Convertir a número

      if (!isNaN(idCategoria)) {
        // Si hay un ID de categoría en la URL, filtrar por esa categoría
        this.obtenerPublicacionesPorCategoria(idCategoria);
      } else {
        // Si no hay ID de categoría en la URL, obtener todas las publicaciones
        this.obtenerPublicaciones();
      }
    });
  }
  obtenerPublicacionesPorCategoria(idCategoria: number): void {
    this.publicacionService.obtenerPublicacionesPorCategoria(idCategoria).subscribe(
      publicaciones => {
        this.publicaciones = publicaciones;
      },
      error => {
        console.error('Error obteniendo publicaciones por categoría:', error);
      }
    );
  }


  obtenerPublicaciones(): void {
    this.publicacionService.obtenerPublicaciones()
      .subscribe(
        publicaciones => {
          // Ordenar las publicaciones por fecha de creación de forma descendente
          this.publicaciones = publicaciones.sort((a, b) => {
            return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
          });
          console.log('Publicaciones obtenidas:', this.publicaciones);
        },
        error => {
          console.error('Error al obtener las publicaciones:', error);
        }
      );
  }
  

  //hay que bloquear que un usuario no pueda eliminar una publicacion que no sea la suya
  async eliminarPublicacion(id: number): Promise<void> {
    // Mostrar un cuadro de diálogo de confirmación con SweetAlert
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará la publicación y no se podrá deshacer más tarde.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '##3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    // Verificar la opción seleccionada por el usuario
    if (result.isConfirmed) {
      // Llamar al servicio para eliminar la publicación
      this.publicacionService.eliminarPublicacion(id)
        .subscribe(
          () => {
            console.log(`Publicación con ID ${id} eliminada correctamente`);
            // Recargar la página después de eliminar la publicación
            window.location.reload();
          },
          error => {
            console.error('Error al eliminar la publicación:', error);
          }
        );
    } else {
      // El usuario ha cancelado la acción
      console.log('La acción ha sido cancelada');
    }
  }
  
  //mandar id de publicacion al pulsar en comentarios
  verComentarios(idPublicacion:number):void{
    this.router.navigate(['/publicacion',idPublicacion,'comentarios']);
  }

  crearComentario(idPublicacion:number):void{
    this.router.navigate(['publicacion',idPublicacion,'comentar']);
  }
  

}
