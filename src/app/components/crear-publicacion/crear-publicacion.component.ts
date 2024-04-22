import { Component } from '@angular/core';
import { Publicacion } from 'src/app/publicacion';
import { PublicacionService } from 'src/app/services/publicacion.service';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent {
  publicacion: Publicacion = {
    titulo: '',
    contenido: '',
    fecha_creacion: new Date(),
    id_usuario: 1, //para setear mi usuario de la bdd
    id_categoria: 1
  };

  constructor(private publicacionService: PublicacionService) { }

  submitForm() {
    this.publicacionService.crearPublicacion(this.publicacion)
      .subscribe(() => {
        console.log('Publicación creada exitosamente');
        // Puedes hacer redireccionamiento u otras acciones aquí después de crear la publicación
      }, error => {
        console.error('Error al crear la publicación:', error);
        // Maneja el error adecuadamente aquí
      });
  }
}
