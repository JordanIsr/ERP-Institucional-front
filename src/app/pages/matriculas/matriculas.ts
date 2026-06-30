import { Component } from '@angular/core';

@Component({
  selector: 'app-matriculas',
  standalone: true,
  templateUrl: './matriculas.html',
  styleUrls: ['./matriculas.scss']
})
export class Matriculas {

  registrar() {
    console.log('Registrar matrícula');
  }

  actualizar() {
    console.log('Actualizar matrícula');
  }

  anular() {
    console.log('Anular matrícula');
  }

  buscar() {
    console.log('Buscar matrícula');
  }

}