import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Publicacion } from 'src/app/interfaces/publicacion';
import { PublicacionService } from 'src/app/services/publicacion.service';

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




}
