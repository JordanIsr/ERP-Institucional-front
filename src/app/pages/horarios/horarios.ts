import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface BloqueHorario {
  horaInicio: string;
  horaFin: string;
  lunes?: string;
  martes?: string;
  miercoles?: string;
  jueves?: string;
  viernes?: string;
}

@Component({
  selector: 'app-horarios',
  imports: [RouterModule],
  templateUrl: './horarios.html',
  styleUrls: ['./horarios.scss']
})
export class Horarios implements OnInit {

  listaHorarios: BloqueHorario[] = [];

  constructor() { }

  ngOnInit(): void {
    this.cargarHorariosEjemplo();
  }

  cargarHorariosEjemplo(): void {
    this.listaHorarios = [
      {
        horaInicio: '07:00',
        horaFin: '08:30',
        lunes: 'Matemática Estructurada',
        miercoles: 'Matemática Estructurada',
        viernes: 'Tutoría Proyecto'
      },
      {
        horaInicio: '08:30',
        horaFin: '10:00',
        lunes: 'Base de Datos I',
        martes: 'Programación Web',
        miercoles: 'Base de Datos I',
        jueves: 'Programación Web'
      },
      {
        horaInicio: '10:00',
        horaFin: '10:30',
        lunes: 'RECESO',
        martes: 'RECESO',
        miercoles: 'RECESO',
        jueves: 'RECESO',
        viernes: 'RECESO'
      },
      {
        horaInicio: '10:30',
        horaFin: '12:00',
        martes: 'Análisis de Sistemas',
        jueves: 'Análisis de Sistemas',
        viernes: 'Metodología Inv.'
      }
    ];
  }
}