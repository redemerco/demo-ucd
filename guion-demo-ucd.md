# Guion de narración: demo de UCD (video `demo-ucd-muda.mp4`, 12:03)

Renzo y Lea se turnan por sección. Cada fila marca el segundo en que arranca ese paso en el video; las frases son cortas para que entren antes del paso siguiente (ritmo cómodo: unas 2 palabras por segundo).

| Tiempo | Quién | Qué dice |
|---|---|---|
| 0:00 | Renzo | Hola, somos Renzo y Lea. Esta es la demo de UCD, empezando por el registro. |
| | **1. Registro e ingreso (Renzo)** | |
| 0:06 | Renzo | Primero, una cédula inválida. La rechaza: tiene que tener entre seis y ocho dígitos. |
| 0:19 | Renzo | Ahora un correo sin arroba. También lo rechaza, valida el formato. |
| 0:31 | Renzo | Con la cédula de otro usuario que ya existe, tampoco deja. La cédula es única. |
| 0:44 | Renzo | Lo mismo con el correo: no se puede repetir. |
| 0:56 | Renzo | Ahora sí, un registro correcto. Queda activo, pero sin permisos, hasta que un administrador le asigne un tipo. |
| 1:09 | Renzo | Probamos el ingreso con un correo que no existe: lo rechaza. |
| 1:18 | Renzo | Y con la contraseña equivocada, también. |
| 1:27 | Renzo | Entramos con el usuario nuevo. Como no tiene permisos, el menú casi no tiene opciones. |
| | **2. Administrador: usuarios y tipos de usuario (Lea)** | |
| 1:38 | Lea | Ahora ingresamos como administradora, que gestiona usuarios y tipos de usuario. |
| 1:47 | Lea | Vamos a la pantalla de usuarios. |
| 1:52 | Lea | Le asignamos el tipo estudiante a Demo Nuevo. Eso solo lo puede hacer un administrador. |
| 2:00 | Lea | También se puede crear un usuario desde acá. Nace con una contraseña predeterminada y tiene que cambiarla en su primer ingreso. |
| 2:14 | Lea | Desactivamos la cuenta de Joaquín. Eso también es solo del administrador. |
| 2:21 | Lea | Pasamos a los tipos de usuario. |
| 2:26 | Lea | Editamos el tipo docente. La descripción no pasa de cien caracteres, le cargamos una imagen y configuramos los topes: dos unidades por catálogo y tres préstamos concurrentes. |
| 2:42 | Lea | Si Joaquín intenta ingresar, no puede: su cuenta está desactivada. |
| 2:52 | Lea | Ahora entramos con el usuario que creamos. En el primer ingreso nos obliga a cambiar la contraseña. Probamos con la actual incorrecta, con una nueva débil, y por último con una válida. Arriba ya se ve la imagen del tipo. |
| 3:20 | Lea | Y Demo Nuevo, que ahora es estudiante, ve solamente las operaciones de su tipo. |
| | **3. Gestión de catálogos (Renzo)** | |
| 3:32 | Renzo | Seguimos con los catálogos, ingresando como supervisora. |
| 3:41 | Renzo | Pasamos por el catálogo y entramos a configurar catálogos. |
| 3:49 | Renzo | Un nombre de dos letras no pasa: el mínimo es tres. |
| 3:55 | Renzo | Y uno repetido tampoco: el nombre es único. |
| 4:02 | Renzo | Creamos «Robótica», y funciona. |
| 4:08 | Renzo | Le cambiamos el nombre y guardamos. |
| 4:16 | Renzo | Si intentamos dar de baja Electrónica, que tiene préstamos activos, no lo permite. |
| 4:24 | Renzo | En cambio, el catálogo nuevo no tiene préstamos, así que sí se puede dar de baja. |
| 4:33 | Renzo | Y si entramos como docente, la opción de configurar catálogos ni aparece. Es solo para administradores y supervisores. |
| | **4. Tipos de equipamiento y unidades (Lea)** | |
| 4:44 | Lea | Volvemos como supervisora, ahora para los tipos de equipamiento. |
| 4:53 | Lea | Entramos a configurar catálogos. |
| 4:57 | Lea | En Audiovisual registramos un tipo nuevo. Primero con un nombre muy corto, y lo rechaza. Después con uno válido, el trípode, y queda registrado. |
| 5:15 | Lea | Notebook Lenovo existe en Electrónica y en Audiovisual: son tipos distintos. |
| 5:22 | Lea | Ahora ingresamos como funcionario del centro, que gestiona las unidades. |
| 5:32 | Lea | Vamos a unidades físicas. |
| 5:36 | Lea | Elegimos Audiovisual y el proyector. |
| 5:42 | Lea | Registramos una unidad con una id mal formada, y no la acepta. |
| 5:51 | Lea | Con una id repetida tampoco: la id institucional es única. |
| 5:59 | Lea | Con una válida sí. Queda registrada. |
| 6:07 | Lea | La pasamos a mantenimiento. |
| 6:11 | Lea | Damos de baja otra unidad que estaba disponible. |
| 6:19 | Lea | La dada de baja ya no tiene selector de estado: no puede volver a disponible. |
| 6:26 | Lea | Y si intentamos dar de baja una unidad prestada, el sistema no lo permite. |
| | **5. Consulta y solicitud de préstamo (Renzo)** | |
| 6:35 | Renzo | Ahora vemos los préstamos desde el lado del docente. Ingresamos como Valentina. |
| 6:45 | Renzo | Primero, consultamos el catálogo. |
| 6:49 | Renzo | Elegimos Audiovisual y filtramos por categoría y por unidades disponibles. |
| 6:59 | Renzo | Vamos a solicitar un préstamo. |
| 7:04 | Renzo | Pedimos un proyector. No requiere aprobación, así que se activa solo. |
| 7:13 | Renzo | Pedimos una cámara. Esa sí requiere aprobación, y queda pendiente. |
| 7:20 | Renzo | Si pedimos nueve micrófonos, se pasa del tope de unidades y lo rechaza. |
| 7:27 | Renzo | En el inicio vemos el proyector activo, la cámara pendiente y la fecha esperada de devolución. |
| | **6. Aprobar y rechazar (Lea)** | |
| 7:34 | Lea | Ahora la supervisora resuelve las solicitudes pendientes. |
| 7:43 | Lea | Vamos a aprobaciones. |
| 7:47 | Lea | Aprobamos la de Valentina. |
| 7:52 | Lea | Y rechazamos la de Diego, escribiendo el motivo, que después va a ver el solicitante. |
| 8:01 | Lea | Cuando Valentina vuelve a entrar, ve la notificación de que su cámara fue aprobada, y el préstamo ya figura como activo. |
| | **7. Devoluciones, inventario e histórico (Renzo)** | |
| 8:13 | Renzo | Ahora las devoluciones, como funcionario del centro. |
| 8:22 | Renzo | Entramos a devoluciones. |
| 8:26 | Renzo | Con una fecha anterior al préstamo, no la acepta. |
| 8:32 | Renzo | Devolvemos el osciloscopio, sin observaciones. |
| 8:36 | Renzo | Y la cámara de Mateo la devolvemos dañada, con una observación. Esa unidad pasa a mantenimiento. |
| 8:46 | Renzo | Vemos cómo quedó en el inventario. |
| 8:51 | Renzo | En Audiovisual, la cámara figura en mantenimiento. |
| 8:57 | Renzo | Y en Electrónica, el osciloscopio vuelve a estar disponible. |
| 9:04 | Renzo | El histórico lo ve la supervisora, así que cambiamos de usuario. |
| 9:13 | Renzo | Entramos al histórico. |
| 9:18 | Renzo | Acá quedan todos los préstamos y las devoluciones de cada unidad. |
| | **8. Notificaciones (Lea)** | |
| 9:24 | Lea | Ahora las notificaciones. Entramos como Mateo, que es estudiante, y ve una solicitud aprobada y otra rechazada. |
| 9:37 | Lea | Marcamos una como leída y desaparece. |
| 9:42 | Lea | Y Camila tiene una notificación por un préstamo vencido que todavía no devolvió. |
| | **9. Auditoría y exportación (Renzo)** | |
| 9:55 | Renzo | Pasamos a la auditoría, como administradora. |
| 10:04 | Renzo | Entramos al log de auditoría. |
| 10:09 | Renzo | Acá están los registros de usuarios, préstamos y devoluciones, con fecha ISO, usuario y acción. |
| 10:17 | Renzo | Filtramos por el correo de Lucía y por fechas, y quedan solo sus movimientos. |
| 10:27 | Renzo | Y vamos a exportar. |
| 10:30 | Renzo | Elegimos el rango de fechas y descargamos el CSV y el XLSX. Acá se ve el contenido de cada archivo: los préstamos y las devoluciones del período. |
| | **10. Límites entre catálogos (Lea)** | |
| 10:51 | Lea | Cerramos con la comprobación de límites. Volvemos como docente. |
| 11:00 | Lea | Vamos a préstamos. |
| 11:05 | Lea | Cada solicitud ofrece solo los tipos de un catálogo: no se pueden mezclar unidades de catálogos distintos. |
| 11:16 | Lea | Pedimos otro micrófono en Audiovisual, que ya tiene dos unidades prestadas: se rechaza. |
| 11:25 | Lea | Un notebook en Electrónica sí se permite: son solicitudes separadas por catálogo. |
| 11:34 | Lea | Pero un microscopio en Biotecnología sería el cuarto préstamo, y el máximo es tres, así que se rechaza. |
| 11:43 | Lea | Por último, intentamos dar de baja Biotecnología, que tiene préstamos activos: no se puede. |
| 11:55 | Renzo | Con esto recorrimos todos los requerimientos del obligatorio. Gracias por mirar. |

Reparto: Renzo ≈ 5.9 min, Lea ≈ 6.0 min de pantalla.

> Confirmar antes de grabar: la letra pide mencionar los requerimientos que no se hayan podido completar. Si hay alguno, agregar una frase en el cierre (11:55).
