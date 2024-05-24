import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from 'src/app/interfaces/categoria';
import { PublicacionDTO } from 'src/app/interfaces/publicacion-dto';
import { AuthService } from 'src/app/services/auth.service';
import { PublicacionService } from 'src/app/services/publicacion.service';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent implements OnInit {

  constructor(private publicacionService: PublicacionService, private router: Router,private authService:AuthService,private toastr: ToastrService) { }

  publicacionDTO: PublicacionDTO = {
    titulo: '',
    contenido: '',
    fecha_creacion: new Date(),
    id_usuario: 0,
    id_categoria: 0
  };

  categorias: Categoria[] = [
    { id: 0, nombre: 'Seleccionar categoría' },
    { id: 1, nombre: 'Deportes' },
    { id: 2, nombre: 'Tecnología' },
    { id: 3, nombre: 'Entretenimiento' },
    { id: 4, nombre: 'Política' },
    { id: 5, nombre: 'Videojuegos' },
    { id: 6, nombre: 'Música' },
    { id: 7, nombre: 'Arte' },
    { id: 8, nombre: 'Otros' }
  ];

  selectedCategoria: number = 0; // Variable para almacenar el ID de la categoría seleccionada

  ngOnInit(): void {
    const idUsuario = this.getUserId();
    if (idUsuario !== null) {
      this.publicacionDTO.id_usuario = parseInt(idUsuario); // Convertir a número
    } else {
      console.error('ID de usuario no válido');
    }
  }
  

  getUserId(): string | null {
    return  this.authService.getUserId();
  }

  submitForm() {
    if (this.selectedCategoria === 0) {
      console.error('Debe seleccionar una categoría válida');
      this.toastr.warning('Debes seleccionar una categoría','',{
        timeOut:1000
      });
      return;
    }

    this.publicacionDTO.id_categoria = this.selectedCategoria;
    this.publicacionService.crearPublicacion(this.publicacionDTO)
      .subscribe(() => {
        console.log('Publicación creada exitosamente');
        this.toastr.success('Publicación creada correctamente','',{
          timeOut:1000
        });
        // Manejar publicación exitosa
        this.router.navigate(['main']);
      }, error => {
        console.error('Error al crear la publicación:', error);
      });
  }
}
