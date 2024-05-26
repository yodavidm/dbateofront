import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-seguidores',
  templateUrl: './seguidores.component.html',
  styleUrls: ['./seguidores.component.css']
})
export class SeguidoresComponent implements OnInit {

  seguidores: any[] = [];
  page!: number;


  constructor(private router: Router,private route:ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state && navigation.extras.state['seguidores']) {
      this.seguidores = navigation.extras.state['seguidores'];
    }
  }

  ngOnInit(): void {
  }

  cambiarPagina(nuevaPagina: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: nuevaPagina },
      queryParamsHandling: 'merge', // Mantener otros parámetros de la URL
    });
  }
}
