# ERP Institucional — flujo académico

## Roles

- **Administrador:** periodos, catálogos, carreras, mallas, niveles, asignaturas, carreras por periodo, paralelos, cupos y docentes.
- **Secretaría:** estudiantes nuevos, solicitudes, documentos y matrícula oficial.
- **Docente:** registro de NP1, NP2 y recuperación.
- **Estudiante:** solicitud de matrícula e historial propio.

## Orden de configuración

1. Crear los periodos académicos.
2. Crear carreras, asignaturas, docentes, centros y aulas.
3. Crear para cada carrera una malla con todos sus niveles y asignaturas.
4. Activar la malla completa.
5. En **Carreras por periodo**, asociar periodo, carrera, centro y jornada. La malla activa se hereda automáticamente.
6. Crear los paralelos de cada nivel, elegir aula/cupo y asignar docente a cada materia.
7. Verificar en **Resumen académico** que la oferta esté lista.
8. Secretaría puede matricular estudiantes nuevos; los antiguos solicitan el siguiente periodo desde su cuenta.

## Condiciones para que una oferta aparezca disponible

- Periodo no cerrado y asociación activa.
- Malla activa para estudiantes nuevos.
- Primer nivel con asignaturas.
- Paralelo con aula y cupo.
- Todas las materias del nivel con docente.
- Cupos disponibles.

## Prueba mínima de aceptación

Crear dos carreras en un periodo, una con jornadas MATUTINA y VESPERTINA. Crear paralelos de 30 cupos, completar docentes y matricular un estudiante. Comprobar que la ocupación cambie de 0/30 a 1/30 y que una jornada llena permanezca visible pero bloqueada.
