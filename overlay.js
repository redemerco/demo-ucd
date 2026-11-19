// Superposición para el video: cursor visible, recuadro sobre lo que se va a tocar y pie con "qué hacemos / qué demuestra".
// Se inyecta con context.addInitScript, así sobrevive a los page.goto (cambios de sesión).

function instalar() {
  if (window.__demoOverlay) return;
  if (!document.documentElement) { // en document_start todavía no existe <html>: se espera a que aparezca
    const o = new MutationObserver(() => { if (document.documentElement) { o.disconnect(); instalar(); } });
    o.observe(document, { childList: true });
    return;
  }
  window.__demoOverlay = true;
  const root = document.documentElement;
  const st = document.createElement('style');
  st.textContent = `
    #demo-cursor{position:fixed;left:0;top:0;width:30px;height:30px;z-index:2147483647;pointer-events:none;display:none;filter:drop-shadow(1px 2px 2px rgba(0,0,0,.5))}
    .demo-ripple{position:fixed;border-radius:50%;border:3px solid #ff3b30;z-index:2147483646;pointer-events:none;transform:translate(-50%,-50%);animation:demo-r .6s ease-out forwards}
    @keyframes demo-r{from{opacity:1;width:12px;height:12px}to{opacity:0;width:70px;height:70px}}
    #demo-hl{position:fixed;z-index:2147483645;pointer-events:none;border:3px solid #ff3b30;border-radius:6px;box-shadow:0 0 0 5px rgba(255,59,48,.25);display:none}
    #demo-cap{position:fixed;left:0;right:0;bottom:0;z-index:2147483644;background:rgba(15,23,42,.95);color:#fff;font:17px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;padding:10px 28px 12px;pointer-events:none;min-height:84px;border-top:3px solid #3b82f6}
    #demo-cap .blq{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8fb8ff;margin-bottom:2px}
    #demo-cap .hace{font-weight:600}
    #demo-cap .dem{color:#ffd60a}
    body{padding-bottom:120px !important}`;
  root.appendChild(st);
  const cur = document.createElement('div');
  cur.id = 'demo-cursor';
  cur.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M3 2l7 19 3-8 8-3z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  const hl = document.createElement('div'); hl.id = 'demo-hl';
  const cap = document.createElement('div'); cap.id = 'demo-cap';
  root.append(cur, hl, cap);

  const pintarCap = (b, h, d) => {
    cap.innerHTML = '';
    const mk = (cls, txt) => { const e = document.createElement('div'); e.className = cls; e.textContent = txt; return e; };
    if (b) cap.append(mk('blq', b));
    if (h) cap.append(mk('hace', 'Qué hacemos: ' + h));
    if (d) cap.append(mk('dem', 'Qué demuestra: ' + d));
  };
  window.__demoPoner = (b, h, d) => { try { sessionStorage.setItem('__demoCap', JSON.stringify([b, h, d])); } catch (e) {} pintarCap(b, h, d); };
  window.__demoResaltar = (x, y, w, h) => { Object.assign(hl.style, { display: 'block', left: x - 5 + 'px', top: y - 5 + 'px', width: w + 10 + 'px', height: h + 10 + 'px' }); };
  window.__demoLimpiar = () => { hl.style.display = 'none'; };

  try { const c = JSON.parse(sessionStorage.getItem('__demoCap') || 'null'); if (c) pintarCap(...c); } catch (e) {}
  try { const p = JSON.parse(sessionStorage.getItem('__demoPos') || 'null'); if (p) { cur.style.display = 'block'; cur.style.left = p[0] + 'px'; cur.style.top = p[1] + 'px'; } } catch (e) {}
  document.addEventListener('mousemove', (e) => {
    cur.style.display = 'block'; cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
    try { sessionStorage.setItem('__demoPos', JSON.stringify([e.clientX, e.clientY])); } catch (err) {}
  }, true);
  document.addEventListener('mousedown', (e) => {
    const r = document.createElement('div'); r.className = 'demo-ripple'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    root.appendChild(r); setTimeout(() => r.remove(), 700);
  }, true);
}

const OVERLAY = `(${instalar.toString()})()`;

// Pie por paso: [qué hacemos, qué demuestra]. Si un nombre se repite, es una lista de pares (uno por aparición).
const L = {
  'registro cédula inválida': ['Completamos el registro con la cédula «123»', 'Validación de la cédula (6 a 8 dígitos y dígito verificador)'],
  'registro correo inválido': ['Registramos un usuario con un correo sin «@»', 'Validación del formato del correo'],
  'registro cédula repetida': ['Registramos con la cédula de otro usuario ya existente', 'La cédula no puede repetirse'],
  'registro correo repetido': ['Registramos con el correo de otro usuario ya existente', 'El correo es único'],
  'registro válido': ['Registramos a «Demo Nuevo» con datos correctos', 'Queda registrado, activo y sin permisos hasta que un administrador le asigne un tipo'],
  'ingreso correo inexistente': ['Intentamos ingresar con un correo que no existe', 'El ingreso se rechaza'],
  'ingreso contraseña incorrecta': ['Ingresamos con el correo correcto y una contraseña equivocada', 'El ingreso se rechaza'],
  'ingreso usuario nuevo (Sin permisos)': ['Ingresamos con el usuario recién registrado', 'Queda con el tipo «Sin permisos»: el menú casi no tiene operaciones'],
  'login admin': [['Ingresamos como Administradora (Laura Martínez)', 'Perfil que gestiona usuarios y tipos de usuario'], ['Ingresamos como Administradora', 'Perfil que consulta la auditoría y exporta el histórico']],
  'asignar tipo a Demo Nuevo': ['En «Usuarios» elegimos el tipo «Estudiante» para Demo Nuevo y confirmamos', 'Asignación de tipo: solo un administrador puede hacerlo'],
  'crear usuario (queda con contraseña por defecto)': ['Creamos un usuario nuevo con el formulario de la misma pantalla', 'Nace con contraseña predeterminada y tendrá que cambiarla en su primer ingreso'],
  'desactivar a Joaquín': ['Desactivamos la cuenta de Joaquín Ramos y confirmamos', 'Solo un administrador desactiva usuarios'],
  'descripción > 100 caracteres, imagen, topes': ['En «Tipos de usuario» editamos el tipo Docente: descripción de 130 caracteres, imagen y topes', 'Máximo 100 caracteres, imagen del tipo, unidades por catálogo y préstamos concurrentes'],
  'desactivado no ingresa': ['Intentamos ingresar con la cuenta desactivada de Joaquín', 'Un usuario desactivado no puede ingresar'],
  'primer ingreso: cambio de contraseña': ['Ingresamos con el usuario creado (contraseña inicial) y cambiamos la contraseña', 'Cambio obligatorio en el primer ingreso: valida la actual y los requisitos de la nueva. La imagen del tipo se ve arriba'],
  'Demo Nuevo ya es Estudiante: ve solo las opciones de su tipo': ['Ingresamos con Demo Nuevo, que ahora es Estudiante', 'Solo ve las operaciones habilitadas para su tipo'],
  'login supervisor': [['Ingresamos como Supervisora (Sofía Pereira)', 'Perfil que gestiona catálogos y aprueba préstamos'], ['Ingresamos como Supervisora', 'Perfil que gestiona catálogos y tipos de equipamiento'], ['Ingresamos como Supervisora', 'Perfil que aprueba o rechaza solicitudes pendientes']],
  'ir a Configurar catálogos': ['Abrimos «Configurar catálogos» desde el menú', 'Pantalla de gestión de catálogos'],
  'catálogo nombre corto': ['Creamos un catálogo llamado «ab»', 'El nombre debe tener entre 3 y 80 caracteres'],
  'catálogo nombre repetido': ['Creamos un catálogo con un nombre que ya existe', 'El nombre del catálogo es único'],
  'catálogo Robótica': ['Creamos el catálogo «Robótica»', 'Se pueden crear varios catálogos'],
  'renombrar Robótica': ['Cambiamos el nombre del catálogo y guardamos', 'Modificación de los datos del catálogo'],
  'baja de catálogo con préstamos (rechazo)': [['Intentamos dar de baja «Laboratorio de Electrónica»', 'No se puede eliminar un catálogo con préstamos activos o pendientes'], ['Como Supervisora intentamos dar de baja «Biotecnología»', 'No se puede eliminar un catálogo con préstamos activos o pendientes de autorización']],
  'baja de catálogo vacío': ['Damos de baja el catálogo recién creado, que no tiene préstamos', 'Eliminación lógica permitida cuando no hay préstamos'],
  'Docente no ve Configurar catálogos': ['Ingresamos como Docente y miramos el menú', 'Solo Administradores y Supervisores gestionan catálogos: la opción no aparece'],
  'registrar tipo en Audiovisual': ['En el catálogo «Audiovisual» registramos un tipo: primero con nombre inválido y luego válido', 'Los tipos pertenecen a un único catálogo y se validan sus datos'],
  'mismo nombre en otro catálogo = otro tipo': ['Alternamos entre «Electrónica» y «Audiovisual»', '«Notebook Lenovo ThinkPad» existe en ambos catálogos: son tipos distintos'],
  'login funcionario': [['Ingresamos como Funcionario del centro (Martín Rodríguez)', 'Perfil que gestiona las unidades físicas'], ['Ingresamos como Funcionario del centro', 'Perfil que registra devoluciones y consulta el inventario']],
  'elegir catálogo y tipo': ['En «Unidades físicas» elegimos el catálogo Audiovisual y el tipo Proyector', 'Las unidades pertenecen a un tipo y a un catálogo'],
  'unidad id con formato inválido': ['Registramos una unidad con la id «XX1»', 'La id institucional debe tener formato LLL-0000'],
  'unidad id duplicada': ['Registramos una unidad con una id ya usada (PRY-0001)', 'La id institucional es única'],
  'unidad válida': ['Registramos la unidad PRY-0004', 'Alta de una unidad física válida'],
  'unidad a mantenimiento': ['Pasamos PRY-0004 al estado «En mantenimiento»', 'Una unidad en mantenimiento no se puede prestar'],
  'baja de unidad disponible': ['Damos de baja la unidad PRY-0003, que está disponible', 'La baja de una unidad libre es válida'],
  'unidad dada de baja no vuelve a estar disponible': ['Miramos la fila de la unidad dada de baja', 'Ya no ofrece cambio de estado: no puede volver a estar disponible'],
  'baja a unidad prestada (rechazo)': ['Intentamos dar de baja la cámara CAM-0001, que está prestada', 'Una unidad prestada no se puede dar de baja directamente'],
  'login docente': [['Ingresamos como Docente (Valentina Gómez)', 'Perfil que consulta el catálogo y solicita préstamos'], ['Ingresamos como Docente (Valentina Gómez)', 'Tope de su tipo: 2 unidades por catálogo y 3 préstamos concurrentes']],
  'catálogo y filtros': ['En «Catálogo» elegimos Audiovisual y filtramos por categoría y unidades disponibles', 'Consulta por catálogo con los filtros de la primera entrega'],
  'solicitar sin aprobación (Proyector)': ['En «Préstamos» solicitamos 1 Proyector (catálogo Audiovisual)', 'Tipo sin aprobación previa: se activa solo si hay unidades'],
  'solicitar con aprobación (Cámara)': ['Solicitamos 1 Cámara', 'Tipo que requiere aprobación: queda pendiente'],
  'superar tope de unidades por catálogo': ['Pedimos 9 micrófonos', 'Se respeta el tope de unidades por catálogo del tipo de usuario'],
  'ver Mis solicitudes': ['Abrimos «Inicio» para ver «Mis solicitudes»', 'El Proyector quedó Activo y la Cámara Pendiente; se ve la fecha esperada de devolución'],
  'aprobar solicitud de Valentina': ['En «Aprobaciones» aprobamos la solicitud de Valentina', 'Aprobación de un préstamo pendiente'],
  'rechazar con motivo': ['Rechazamos la solicitud de Diego escribiendo un motivo', 'El rechazo lleva un motivo que verá el solicitante'],
  'la docente ve el resultado': ['Volvemos a ingresar como Valentina', 'Ve la notificación de aprobación y su préstamo ahora Activo'],
  'devolución con fecha anterior (rechazo)': ['En «Devoluciones» intentamos registrar una devolución con fecha 01/01/2020', 'No se acepta una fecha anterior al inicio del préstamo'],
  'devolver sin observaciones (Lucía, osciloscopio)': ['Registramos la devolución del osciloscopio de Lucía, sin observaciones', 'La unidad queda disponible'],
  'devolver dañada (Mateo, cámara)': ['Registramos la devolución de la cámara de Mateo como «Dañada» con una observación', 'Una unidad con daños pasa a mantenimiento'],
  'inventario Audiovisual (cámara en mantenimiento)': ['En «Inventario» elegimos el catálogo Audiovisual', 'Cantidades disponibles, prestadas, en mantenimiento y dadas de baja: la cámara está en mantenimiento'],
  'inventario Electrónica (osciloscopio disponible)': ['Cambiamos al catálogo Electrónica', 'El osciloscopio devuelto vuelve a figurar como disponible'],
  'login supervisor (el Funcionario no tiene histórico)': ['Ingresamos como Supervisora', 'El histórico lo consultan Supervisores y Administradores'],
  'histórico Audiovisual': ['Abrimos «Histórico» y elegimos Audiovisual', 'Historial de movimientos de préstamo y devolución por unidad'],
  'login Mateo (aprobada y rechazada)': ['Ingresamos como Mateo Castro (Estudiante)', 'Al ingresar ve sus notificaciones: solicitud aprobada y solicitud rechazada'],
  'marcar como leída': ['Marcamos una notificación como leída', 'Deja de aparecer en la lista'],
  'login Camila (préstamo vencido)': ['Ingresamos como Camila Núñez (Estudiante)', 'Notificación por un préstamo vencido y aún no devuelto'],
  'registros (se recorre el log)': ['En «Log de auditoría» recorremos los registros hacia abajo', 'Altas de usuarios, préstamos en todos sus estados y devoluciones, con timestamp ISO-8601, usuario y acción'],
  'filtrar por usuario y fechas': ['Filtramos por el correo de Lucía y por un rango de fechas', 'Filtros por rango de fechas y por usuario'],
  'exportar CSV y XLSX': ['En «Exportar histórico» elegimos un rango de fechas y descargamos CSV y XLSX', 'Exportación de préstamos y devoluciones; mostramos el contenido de cada archivo'],
  'no se pueden mezclar catálogos: cada solicitud ofrece solo los tipos de su catálogo': ['En «Préstamos» listamos los tipos que ofrece la solicitud en dos catálogos', 'Una solicitud solo puede tener unidades de un único catálogo'],
  'superar unidades por catálogo (Audiovisual ya tiene 2)': ['Pedimos otro micrófono en Audiovisual (ya tiene 2 unidades prestadas)', 'Se rechaza por superar el máximo de unidades por catálogo'],
  'solicitud en otro catálogo (Electrónica)': ['Solicitamos 1 Notebook en el catálogo Electrónica', 'Se permiten solicitudes separadas por catálogo; ahora suma 3 préstamos'],
  'superar préstamos concurrentes con un tercer catálogo (Biotecnología)': ['Solicitamos 1 Microscopio en el catálogo Biotecnología', 'Se rechaza por superar el máximo de préstamos concurrentes entre todos los catálogos'],
};
const MENU = { registro: 'Registro', usuarios: 'Usuarios', 'tipos-usuario': 'Tipos de usuario', auditoria: 'Log de auditoría', prestamos: 'Préstamos', aprobaciones: 'Aprobaciones', catalogo: 'Catálogo', tipos: 'Catálogo de equipamiento', unidades: 'Unidades físicas', devoluciones: 'Devoluciones', historico: 'Histórico', exportar: 'Exportar histórico', inventario: 'Inventario' };
const cuenta = {};
function leyendaDe(nombre) {
  if (nombre.startsWith('menú ')) {
    const n = MENU[nombre.slice(5)] || nombre.slice(5);
    return [`Abrimos «${n}» desde el menú lateral`, 'Transición hacia la pantalla donde se prueba el siguiente requerimiento'];
  }
  const v = L[nombre];
  if (!v) return null;
  if (Array.isArray(v[0])) { const i = cuenta[nombre] = (cuenta[nombre] ?? -1) + 1; return v[Math.min(i, v.length - 1)]; }
  return v;
}
module.exports = { OVERLAY, leyendaDe };
