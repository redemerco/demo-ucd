# Guion de narración (video mudo de 12:03; límite de la letra: 15:00)

Los tiempos son del video `demo-ucd-muda.mp4`. Cada bloque dice qué verás y qué conviene decir.
El video ya trae cursor, recuadro rojo sobre lo que se toca y un pie con «Qué hacemos / Qué demuestra» en cada paso. Si tu narración es más larga que un bloque, congelá el último cuadro en el editor (margen: ~3 min hasta los 15:00).

| Tiempo | Bloque | Qué se ve (y requerimiento de la letra que cubre) |
|---|---|---|
| 0:03 | 1. Registro e ingreso (Sin permisos) | Registro con cédula inválida, correo sin @, cédula repetida, correo repetido; registro correcto (queda Sin permisos); ingreso con correo inexistente y contraseña incorrecta; el usuario nuevo entra con menú vacío. |
| 1:39 | 2. Administrador: usuarios y tipos | Asigna tipo Estudiante a Demo Nuevo; crea un usuario (contraseña inicial Cambiar1); desactiva a Joaquín; edita el tipo Docente (descripción máx. 100, imagen, topes 2 unidades y 3 préstamos); ingreso del desactivado rechazado; primer ingreso con cambio de contraseña obligatorio (actual incorrecta, nueva débil, nueva válida); Demo Nuevo ya ve solo las opciones de Estudiante. |
| 3:33 | 3. Catálogos (Supervisor) | Nombre corto y repetido rechazados; crear y renombrar un catálogo; baja rechazada con préstamos activos/pendientes; baja de catálogo vacío OK. |
| 4:45 | 4. Tipos de equipamiento y unidades | Tipo con nombre inválido rechazado y tipo válido registrado; "Notebook Lenovo ThinkPad" existe en dos catálogos (tipos distintos); unidad con id inválida y duplicada; unidad válida; pasar a mantenimiento; baja de unidad disponible (ya no vuelve a disponible); baja de unidad prestada rechazada. |
| 6:36 | 5. Consulta y solicitud (Docente) | Catálogo de equipamiento con filtros; solicitud sin aprobación (queda Activo) y con aprobación (queda Pendiente); pedir 9 unidades rechazado; "Mis solicitudes" con fechas esperadas. |
| 7:35 | 6. Aprobar y rechazar (Supervisor) | Aprueba la solicitud de Valentina, rechaza la de Diego con motivo; la docente ve el resultado. |
| 8:14 | 7. Devoluciones, inventario, histórico | Fecha anterior al préstamo rechazada; devolución sin observaciones (queda disponible); devolución "Dañada" con observación (pasa a mantenimiento); inventario por catálogo con todas las cantidades; histórico de movimientos. |
| 9:25 | 8. Notificaciones | Estudiante con aprobada y rechazada; marca una como leída y desaparece; otra con préstamo vencido sin devolver. |
| 9:56 | 9. Auditoría y exportación (Administrador) | Log con timestamp ISO-8601, usuario y acción (usuarios, préstamos, devoluciones); filtro por usuario y fechas; exportación CSV y XLSX con el contenido del período. |
| 10:52 | 10. Límites entre catálogos | Cada solicitud ofrece solo tipos de un catálogo (no se mezclan); supera unidades por catálogo; solicitud en otro catálogo permitida; supera préstamos concurrentes con un tercer catálogo; baja de catálogo con préstamos rechazada. |
| 12:03 | Fin | |

Datos usados: contraseña `Clave2026` (root: `Root1234`). Cuentas: laura (Admin), sofia (Supervisor), martin (Funcionario), valentina/diego (Docentes), lucia/mateo/camila (Estudiantes), joaquin (Sin permisos).
