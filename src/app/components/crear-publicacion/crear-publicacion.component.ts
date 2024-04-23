import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/interfaces/categoria';
import { Publicacion } from 'src/app/interfaces/publicacion';
import { PublicacionService } from 'src/app/services/publicacion.service';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent implements OnInit{
  publicacion: Publicacion = {
    titulo: '',
    contenido: '',
    fecha_creacion: new Date(),
    usuario: {
      nickname: '',
      id: 1
    },
    id_usuario: 1,
    id_categoria: undefined, // Dejamos id_categoria como undefined al inicio
  };

  constructor(private publicacionService: PublicacionService, private router: Router) { }

  ngOnInit(): void {
  }

  categorias: Categoria[] = [
    { id: 0, nombre: 'Seleccionar categoría'},
    { id: 1, nombre: 'Deportes' },
    { id: 2, nombre: 'Tecnología' },
    { id: 3, nombre: 'Entretenimiento'},
    { id: 4, nombre: 'Política'},
    { id: 5, nombre: 'Videojuegos'},
    { id: 6, nombre: 'Música'},
    { id: 7, nombre: 'Arte'},
  ];

  selectedCategoria: number = 0; // Variable para almacenar el ID de la categoría seleccionada

  submitForm() {
      this.publicacion.id_categoria = this.selectedCategoria; // Asignamos el ID de la categoría seleccionada
      this.publicacionService.crearPublicacion(this.publicacion)
        .subscribe(() => {
          console.log('Publicación creada exitosamente');
          // Manejar publicación exitosa
          this.router.navigate(['main']);
        }, error => {
          console.error('Error al crear la publicación:', error);
          // Manejar error
        });
    }
  }

