import { Component, OnInit } from '@angular/core';
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

  constructor(private publicacionService: PublicacionService) { }

  ngOnInit(): void {
    this.obtenerPublicaciones()
  }

  publicaciones!: Publicacion[];
  public page!: number;

  obtenerPublicaciones(): void {
    this.publicacionService.obtenerPublicaciones()
      .subscribe(
        publicaciones => {
          this.publicaciones = publicaciones;
          console.log('Publicaciones obtenidas:', publicaciones);
        },
        error => {
          console.error('Error al obtener las publicaciones:', error);
        }
      );
  }

  //hay que bloquear que un usuario no pueda eliminar una publicacion que no sea la suya
  eliminarPublicacion(id: number): void {
    // Mostrar un cuadro de diálogo de confirmación con SweetAlert
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará la publicación y no se podrá deshacer más tarde.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '##3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
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
      }
    });
  }
  
  




}
