# Cambios de la revisión integral

## Flujos funcionales

- Registro público con consentimiento obligatorio y persistente de privacidad.
- Dashboard y accesos rápidos adaptados al rol.
- Configuración académica progresiva para Administración.
- Matrícula nueva, búsqueda de expedientes y control de cupos para Secretaría.
- Solicitudes, documentos, aprobación, rechazo y reenvío.
- Registro de NP1, NP2 y recuperación para Docente.
- Corrección auditada de notas existentes para Secretaría.
- Historial académico real para Estudiante.
- Configuración de paralelos con cupos mínimo/máximo y docentes por asignatura.

## Pantallas retiradas

- Gestión académica antigua: utilizaba carreras y semestres escritos manualmente.
- Configuración vacía: no tenía funcionalidad real.
- Comprobantes pendientes antiguo: fue reemplazado por Solicitudes pendientes.

## Reglas importantes

- El docente puede registrar cada nota una sola vez.
- Secretaría solo corrige notas existentes y debe indicar el motivo.
- La recuperación solo corresponde cuando NP1 y NP2 producen promedio menor a 7.
- Carrera, periodo, jornada, malla, nivel y paralelo se leen desde la matrícula real.
- La anulación afecta una matrícula, no elimina la ficha del estudiante.
- Las cuentas nuevas comienzan con rol `usuario` hasta autorización administrativa.

## Verificación realizada

- Compilación Angular en configuración de desarrollo.
- Compilación NestJS.
- Pruebas automatizadas existentes del backend.
- Revisión de rutas, roles, enlaces vacíos y endpoints antiguos del frontend.

La prueba final con datos reales debe ejecutarse siguiendo el orden de configuración académica antes de matricular y calificar.
