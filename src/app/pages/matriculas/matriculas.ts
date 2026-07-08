import { Component, inject } from '@angular/core'; // Asegúrate de importar inject
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { EstudiantesService } from './estudiantes.service'; // Importa tu servicio del frontend
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ReactiveFormsModule], // Asegúrate de que esté aquí para usar los formularios
  templateUrl: './matriculas.html',
  styleUrls: ['./matriculas.scss']
})
export class Matriculas {
  private fb = inject(FormBuilder);
  
  // 1. ¡ESTO FALTA! Aquí inyectamos el servicio para que deje de salir el error en rojo
  private estudiantesService = inject(EstudiantesService); 

  matriculaForm = this.fb.group({
    cedula: ['', [Validators.required]],
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    carrera: ['Sistemas', [Validators.required]],
    periodo: ['', [Validators.required]],
    jornada: ['Matutina', [Validators.required]],
    
    // 2. Les quitamos el required por ahora para que te deje guardar los datos de texto:
    fotografia: [''], 
    certificado: [''],
    estado: ['APROBADA']
  });

  registrar() {
    // 🔍 DETECTOR DE ERRORES: Imprime en la consola qué campo está fallando
    Object.keys(this.matriculaForm.controls).forEach(key => {
      const controlErrors = this.matriculaForm.get(key)?.errors;
      if (controlErrors != null) {
        console.log(`❌ El campo [${key}] es inválido debido a:`, controlErrors);
      }
    });

    if (this.matriculaForm.valid) {
      this.estudiantesService.matricularEstudiante(this.matriculaForm.value).subscribe({
        next: (res: any) => { 
          alert('¡Estudiante guardado con éxito en la Base de Datos! 🎉');
          this.matriculaForm.reset({ carrera: 'Sistemas', jornada: 'Matutina', estado: 'APROBADA' });
        },
        error: (err: any) => { 
          alert('Error al guardar en el servidor.');
          console.error(err);
        }
      });
    } else {
      alert('Por favor, completa todos los campos requeridos.');
      this.matriculaForm.markAllAsTouched(); 
    }
  } 
}