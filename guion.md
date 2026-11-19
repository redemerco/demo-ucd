# Guion demo UCD (máx. 15 min, muda; narran después)

Datos: `base-de-datos/UCD-datos-prueba.sql`. Contraseña de todos: `Clave2026` (root: `root@ucd.edu.uy` / `Root1234`).

| Perfil | Cuenta |
|---|---|
| Administrador | laura.martinez@ort.edu.uy (también root) |
| Supervisor | sofia.pereira@ort.edu.uy |
| Funcionario | martin.rodriguez@ort.edu.uy |
| Docente | valentina.gomez@ / diego.fernandez@ort.edu.uy |
| Estudiante | lucia.silva@ / mateo.castro@ / camila.nunez@ort.edu.uy |
| Sin permisos | joaquin.ramos@ort.edu.uy |

Estado precargado útil: pendientes #2 (Lucía, Arduino, req. aprobación) y #10 (Diego, Centrífuga, req. aprobación); activos vencidos #5 (Camila) y #9 (Diego); notificaciones sin leer de Mateo (aprobado y rechazado), Camila y Diego (vencido); catálogo "Equipos 2025" inactivo.

## Bloques (tiempo / perfil / ruta de pantallas / qué mostrar)

1. **0:00-2:00 · Sin permisos → Admin · Registro e ingreso**
   `/registro` → registrar "Demo Nuevo" (cédula inválida, correo mal formado, DNI y correo repetidos: ver rechazos) → alta correcta → `/login`: correo inexistente, contraseña incorrecta → ingresar con el nuevo → queda Sin permisos (menú casi vacío) → Cerrar sesión.
2. **2:00-4:30 · Administrador · Usuarios y tipos**
   `/login` laura → `/usuarios`: asignar tipo a "Demo Nuevo"; crear usuario con el formulario (queda con cambio de contraseña obligatorio); desactivar a Joaquín (confirmación) → `/tipos-usuario`: descripción de más de 100 caracteres (rechazo), subir imagen (se ve arriba en todas las pantallas), configurar unidades por catálogo y préstamos concurrentes → Cerrar sesión → ingresar con Joaquín (desactivado: rechazo) → ingresar con el usuario creado → `/cambiar-contrasenia` (actual incorrecta, nueva débil, nueva válida).
3. **4:30-6:00 · Administrador/Supervisor · Catálogos**
   (sofia) `/catalogo`: crear "Robótica" (nombre de 2 caracteres y duplicado: rechazo), editar nombre, intentar "Dar de baja" Electrónica con préstamos activos (rechazo) → dar de baja "Robótica" (OK). Mostrar que un Docente no ve "Configurar catálogos".
4. **6:00-7:30 · Supervisor/Funcionario · Tipos y unidades**
   `/catalogo` (Registrar tipo en Audiovisual; mismo nombre "Notebook Lenovo ThinkPad" ya existe en dos catálogos = tipos distintos) → (martin) `/unidades`: registrar unidad (id duplicada: rechazo), pasar a mantenimiento, intentar dar de baja una prestada (rechazo), dar de baja una disponible, intentar volverla a disponible (rechazo).
5. **7:30-9:30 · Docente/Estudiante · Consulta y solicitud**
   (lucia) `/tipos` (Catálogo de equipamiento): elegir catálogo, filtros categoría/estado/mínimo disponibles → `/prestamos`: elegir catálogo y tipo; solicitar tipo sin aprobación (queda activo) y otro con aprobación (queda pendiente); superar tope de unidades por catálogo (rechazo) → Inicio `/` (Mis solicitudes).
6. **9:30-10:30 · Supervisor · Aprobar/rechazar**
   (sofia) `/aprobaciones`: aprobar #2, rechazar #10 con motivo → (diego) `/` ver el resultado.
7. **10:30-12:00 · Funcionario · Devoluciones e inventario**
   (martin) `/devoluciones`: fecha anterior al inicio (rechazo); devolver #1 "Sin observaciones" (disponible); devolver #3 "Dañada" (a mantenimiento) → `/inventario` (cantidades reales) → `/historico` (movimientos).
8. **12:00-13:00 · Docente/Estudiante · Notificaciones**
   (mateo) `/` panel de notificaciones: aprobada y rechazada → marcar una como leída (desaparece) → (camila) `/`: notificación de préstamo vencido.
9. **13:00-14:00 · Administrador · Auditoría y exportación**
   (laura) `/auditoria`: registros de usuarios, préstamos, devoluciones con timestamp ISO-8601 → filtrar por fechas y por usuario → `/exportar`: rango de fechas, Descargar CSV y XLSX (mostrar abiertos).
10. **14:00-15:00 · Integrado · Límites y catálogos**
   (valentina) `/prestamos`: solicitud en Electrónica y otra en Audiovisual (separadas, OK) → superar préstamos concurrentes entre catálogos (rechazo) → (sofia) `/catalogo`: dar de baja catálogo con préstamos activos/pendientes (rechazo).

Mencionar en cierre qué no está implementado, si algo (la letra lo pide).

## A verificar antes de grabar
- Valores de los topes en `/tipos-usuario` para cada tipo (ajustar los pasos 5 y 10 a esos números).
- Que "Mezclar catálogos en una solicitud" esté bloqueado por UI (el formulario elige un tipo, que ya es de un solo catálogo).
- Que el usuario creado por admin pida cambio de contraseña al primer ingreso.
- No hay cuenta desactivada en el seed: se desactiva a Joaquín en el paso 2 (o agregar una al SQL).
