import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-seguidos',
  templateUrl: './seguidos.component.html',
  styleUrls: ['./seguidos.component.css']
})
export class SeguidosComponent implements OnInit {
  seguidos: any[] = [];
  page!: number;

  constructor(private router: Router,private route:ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state && navigation.extras.state['seguidos']) {
      this.seguidos = navigation.extras.state['seguidos'];
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
