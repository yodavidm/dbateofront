import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/interfaces/categoria';
import { Publicacion } from 'src/app/interfaces/publicacion';
import { PublicacionDTO } from 'src/app/interfaces/publicacion-dto';
import { PublicacionService } from 'src/app/services/publicacion.service';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent implements OnInit{

  publicacionDTO:PublicacionDTO={
    titulo:'',
    contenido:'',
    fecha_creacion:new Date(),
    id_usuario:2,
    id_categoria:0
  }

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
      this.publicacionDTO.id_categoria = this.selectedCategoria; //esta hecho asi para poder sacar nombre de categoria
      this.publicacionService.crearPublicacion(this.publicacionDTO)
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

