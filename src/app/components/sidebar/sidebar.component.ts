import { Component } from '@angular/core';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  categorias: { id: number, nombre: string }[] = [
    { id: 1, nombre: 'Deportes' },
    { id: 2, nombre: 'Tecnología' },
    { id: 3, nombre: 'Entretenimiento' },
    { id: 4, nombre: 'Política' },
    { id: 5, nombre: 'Videojuegos' },
    { id: 6, nombre: 'Música' },
    { id: 7, nombre: 'Arte' },
    { id: 8, nombre: 'Otros' }

  ];


}
