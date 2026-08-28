# Correcciones académicas aplicadas

- Catálogos visibles: carreras, docentes y centros de estudio.
- Las asignaturas se crean, editan, mueven y eliminan desde los niveles de cada malla.
- Diseñador de mallas con carrera, código, vigencia, duración de 1–5 años y cantidad exacta de niveles.
- Vista filtrada por carrera, malla y niveles con sus asignaturas.
- Periodos limitados al formato `AAAA-I` o `AAAA-II` y fechas coherentes.
- Paralelos con cupos mínimo/máximo y asignación de docentes por materia.
- Matrícula basada en carrera, periodo, malla, nivel, jornada y paralelo.
- Retiro total de pantallas, rutas y servicios de espacios físicos y planificación temporal.
- Todas las calificaciones se muestran con dos decimales, por ejemplo `8.00`.
- Secretaría puede generar el reporte PDF del historial de correcciones de calificaciones.
- Registro e inicio de sesión reducidos a usuario (los 10 dígitos de la cédula) y contraseña.
- Los campos de cédula y teléfono eliminan letras y limitan la entrada a 10 dígitos.
- Mensajes concretos para cada dato obligatorio o incorrecto en autenticación, matrícula, estudiantes, catálogos, mallas, periodos, oferta y paralelos.
- Teléfono, correo, nombres y apellidos son obligatorios en las fichas estudiantiles; el correo y los datos personales también se validan en docentes.
- Cupos y cantidad de niveles aceptan únicamente enteros dentro de los límites configurados.
- Las notas rechazan valores fuera de 0–10 o con más de dos decimales.
- Los periodos `AAAA-I` y `AAAA-II` se crean de forma independiente; no es obligatorio registrar ambos para el mismo año.

## Validación

El frontend valida formatos, campos obligatorios, longitudes y rangos antes de enviar. El backend vuelve a validar todas las reglas para impedir que se evadan desde Postman u otro cliente.
