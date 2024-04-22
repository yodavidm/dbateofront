import { Component } from '@angular/core';
import { Publicacion } from 'src/app/publicacion';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  publicaciones = [
    { titulo: 'Publicación 1', contenido: '' },
    { titulo: 'Publicación 2', contenido: 'Contenido de la publicación 2 ' },
    { titulo: 'Publicación 3', contenido: 'Contenido de la publicación 3' },
    { titulo: 'Publicación 1', contenido: 'Contenido de la publicación 1' },
    { titulo: 'Publicación 2', contenido: 'Contenido de la publicación 2' },
    
    // Agrega más publicaciones según necesites
  ];
  

  
}
