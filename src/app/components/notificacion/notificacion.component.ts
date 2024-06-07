import { Component, OnInit } from '@angular/core';
import { Notificacion } from 'src/app/interfaces/notificacion';
import { AuthService } from 'src/app/services/auth.service';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {

  notificaciones: Notificacion[] = []; // Inicializa la variable notificaciones como un array vacío
  id!: number;

  constructor(private notificacionService: NotificacionService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getUserId();
    this.obtenerNotificaciones();
  }

  getUserId() {
    const idUser = this.authService.getUserId();
    if (idUser !== null) {
      this.id = parseInt(idUser);
    }
  }

  obtenerNotificaciones() {
    this.notificacionService.verNotificaciones(this.id).subscribe({
      next: notificaciones => {
        // Ordenar notificaciones del más reciente al más antiguo
        this.notificaciones = notificaciones.sort((a, b) => {
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
        console.log(this.notificaciones);
      },
      error: error => {
        console.error("Error al obtener notificaciones", error);
      }
    });
  }
  

  eliminarNotis() {
    this.notificacionService.eliminarNotis(this.id).subscribe(
      () => {
        console.log("Se eliminaron las notificaciones correctamente");
        location.reload(); // Recargar la página después de eliminar las notificaciones
      },
      error => {
        console.error("Error al eliminar las notificaciones:", error);
      }
    );
  }
  


}
