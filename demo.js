// V1 demo muda UCD. Uso: node demo.js   (app en http://localhost:5099, base con datos de prueba)
// Graba salida/*.webm y escribe salida/tiempos.txt con el minuto de cada bloque (para narrar).
// Importante: la sesión vive en el circuito Blazor, así que se navega SOLO con clics del menú (goto = cerrar sesión).
const { chromium } = require('playwright');
const fs = require('fs');
const { OVERLAY, leyendaDe } = require('./overlay');

const URL = process.env.URL || 'http://localhost:5099';
const CLAVE = 'Clave2026';
const U = {
  root: ['root@ucd.edu.uy', 'Root1234'],
  admin: ['laura.martinez@ort.edu.uy', CLAVE],
  supervisor: ['sofia.pereira@ort.edu.uy', CLAVE],
  funcionario: ['martin.rodriguez@ort.edu.uy', CLAVE],
  docente: ['valentina.gomez@ort.edu.uy', CLAVE],
  docente2: ['diego.fernandez@ort.edu.uy', CLAVE],
  estudiante: ['lucia.silva@ort.edu.uy', CLAVE],
  estudiante2: ['mateo.castro@ort.edu.uy', CLAVE],
  estudiante3: ['camila.nunez@ort.edu.uy', CLAVE],
  joaquin: ['joaquin.ramos@ort.edu.uy', CLAVE],
};

const RITMO = Number(process.env.RITMO || 0.8); // 1 = normal; 0.5 = más rápido para pruebas
const t0 = Date.now();
const tiempos = [];
const fallas = [];
let page;

const espera = (ms) => page.waitForTimeout(ms * RITMO);
const mm = () => { const s = Math.round((Date.now() - t0) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
let bloqueActual = '';
const bloque = (n) => { bloqueActual = n; const l = `${mm()}  ${n}`; console.log(l); tiempos.push(l); };
const poner = (h, d) => page.evaluate(([b, x, y]) => window.__demoPoner && window.__demoPoner(b, x, y), [bloqueActual, h, d]).catch(() => {});

// Ejecuta un paso; si falla lo anota y sigue (la demo no se corta por un selector).
let pasoActual = '', nCaptura = 0;
async function paso(nombre, fn) {
  pasoActual = nombre;
  if (process.env.TRAZA) console.log('   >', nombre);
  const ley = leyendaDe(nombre);
  if (ley) { await poner(ley[0], ley[1]); await espera(1700); } // tiempo para leer el pie antes de actuar
  try { await fn(); }
  catch (e) { fallas.push(`${mm()} ${nombre}: ${e.message.split('\n')[0]}`); console.log('  FALLA', nombre, '-', e.message.split('\n')[0]); }
  await espera(500);
}

const menu = (href) => paso(`menú ${href}`, async () => { await clic(page.locator(`nav a[href="${href}"]`)); await page.waitForLoadState('networkidle'); await page.locator('h1').first().waitFor(); await espera(2000); });
// Mueve el cursor de forma visible hasta el elemento y lo recuadra antes de actuar.
const moverA = async (loc) => {
  await loc.scrollIntoViewIfNeeded();
  let b = await loc.boundingBox(); if (!b) return;
  if (b.y + b.height > 900 - 170) { await loc.evaluate((e) => e.scrollIntoView({ block: 'center' })); await espera(300); b = await loc.boundingBox(); } // que el pie no tape el elemento
  await page.mouse.move(b.x + Math.min(b.width / 2, 120), b.y + b.height / 2, { steps: 22 });
  await page.evaluate(([x, y, w, h]) => window.__demoResaltar && window.__demoResaltar(x, y, w, h), [b.x, b.y, b.width, b.height]).catch(() => {});
  await espera(400);
};
const limpiarRecuadro = () => page.evaluate(() => window.__demoLimpiar && window.__demoLimpiar()).catch(() => {});
const escribir = async (sel, txt) => { const l = page.locator(sel); await moverA(l); await l.click(); await limpiarRecuadro(); await l.fill(''); await l.pressSequentially(txt, { delay: 30 }); };
const clic = async (loc) => { for (let i = 0; i < 3; i++) { try { await moverA(loc); await loc.click(); await limpiarRecuadro(); await espera(250); return; } catch (e) { if (i == 2) throw e; await espera(700); } } };
const elegir = async (selectLoc, regex) => {
  const opts = await selectLoc.locator('option').allTextContents();
  const v = opts.find((o) => regex.test(o));
  if (!v) throw new Error(`sin opción ${regex} en [${opts.join(' | ')}]`);
  await moverA(selectLoc); await selectLoc.selectOption({ label: v }); await limpiarRecuadro(); await espera(300);
};
// deja visible el último mensaje (error o éxito) un momento para que se pueda narrar
const foto = async () => { // captura de evidencia sin mensaje
  fs.mkdirSync('capturas', { recursive: true });
  await page.screenshot({ path: `capturas/${String(++nCaptura).padStart(3, '0')}-${pasoActual.replace(/[^a-zA-Z0-9áéíóúñ]+/g, '_')}.png` }).catch(() => {});
};
const mostrarMensaje = async () => {
  await page.locator('.alert:visible').last().evaluate((e) => e.scrollIntoView({ block: 'center' })).catch(() => {}); // .alert:visible evita el #blazor-error-ui oculto (también tiene role=alert)
  await espera(700);
  fs.mkdirSync('capturas', { recursive: true });
  await page.screenshot({ path: `capturas/${String(++nCaptura).padStart(3, '0')}-${pasoActual.replace(/[^a-zA-Z0-9áéíóúñ]+/g, '_')}.png` }).catch(() => {});
  await espera(1100);
};

async function ingresar([email, clave]) {
  await page.goto(`${URL}/login`); // goto = circuito nuevo = sesión cerrada
  await page.waitForLoadState('networkidle');
  await espera(600);
  await escribir('#email', email); await escribir('#contraseña', clave);
  await clic(page.getByRole('button', { name: 'Ingresar' }));
  await page.waitForLoadState('networkidle'); await espera(1500);
}
async function intentarIngreso([email, clave]) {
  await page.goto(`${URL}/login`); await page.waitForLoadState('networkidle'); await espera(500);
  await escribir('#email', email); await escribir('#contraseña', clave);
  await clic(page.getByRole('button', { name: 'Ingresar' })); await mostrarMensaje();
}
// Muestra el contenido de un archivo descargado sobre la pantalla (el navegador no lo abre solo).
const verArchivo = async (titulo, texto) => {
  await page.evaluate(([t, x]) => {
    const d = document.createElement('div'); d.id = 'visor-archivo';
    d.style.cssText = 'position:fixed;inset:50px 40px;background:#fff;border:3px solid #1f6feb;border-radius:8px;z-index:99999;padding:16px;overflow:auto;box-shadow:0 8px 40px rgba(0,0,0,.5)';
    d.innerHTML = '<h3 style="margin:0 0 8px;font-size:16px">' + t + '</h3><pre style="font-size:12px;white-space:pre-wrap;margin:0">' + x.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>';
    document.body.appendChild(d);
  }, [titulo, texto]);
  await espera(4500); await foto(); await espera(2500);
  await page.evaluate(() => document.getElementById('visor-archivo')?.remove());
};
const confirmar = async () => { await clic(page.locator('button.btn-danger:visible').last()); await espera(1200); };

(async () => {
  fs.mkdirSync('salida', { recursive: true });
  const browser = await chromium.launch({ headless: !process.env.VER, slowMo: Number(process.env.SLOWMO ?? 120) });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, recordVideo: { dir: 'salida', size: { width: 1600, height: 900 } }, acceptDownloads: true });
  await ctx.addInitScript(OVERLAY);
  page = await ctx.newPage(); page.setDefaultTimeout(6000); page.setDefaultNavigationTimeout(15000);
  await page.goto(URL); await page.waitForLoadState('networkidle'); await espera(2000);

  // ───────── 1. Registro e ingreso (Sin permisos) ─────────
  bloque('1. Registro e ingreso');
  await menu('registro');
  const registrar = async (dni, nom, ape, mail, clave) => {
    await escribir('#dni', dni); await escribir('#nombre', nom); await escribir('#apellido', ape);
    await escribir('#email', mail); await escribir('#contraseña', clave);
    await clic(page.getByRole('button', { name: 'Registrarme' })); await mostrarMensaje();
  };
  await paso('registro cédula inválida', () => registrar('123', 'Demo', 'Nuevo', 'demo.nuevo@ort.edu.uy', 'Demo1234'));
  await paso('registro correo inválido', () => registrar('47654325', 'Demo', 'Nuevo', 'demo.nuevo', 'Demo1234'));
  await paso('registro cédula repetida', () => registrar('54567890', 'Demo', 'Nuevo', 'demo.nuevo@ort.edu.uy', 'Demo1234'));
  await paso('registro correo repetido', () => registrar('47654325', 'Demo', 'Nuevo', 'joaquin.ramos@ort.edu.uy', 'Demo1234'));
  await paso('registro válido', () => registrar('47654325', 'Demo', 'Nuevo', 'demo.nuevo@ort.edu.uy', 'Demo1234'));
  await paso('ingreso correo inexistente', () => intentarIngreso(['no.existe@ort.edu.uy', 'Demo1234']));
  await paso('ingreso contraseña incorrecta', () => intentarIngreso(['demo.nuevo@ort.edu.uy', 'Incorrecta1']));
  await paso('ingreso usuario nuevo (Sin permisos)', async () => { await ingresar(['demo.nuevo@ort.edu.uy', 'Demo1234']); await espera(2500); });

  // ───────── 2. Administrador: usuarios y tipos ─────────
  bloque('2. Administrador: usuarios, tipos de usuario');
  await paso('login admin', () => ingresar(U.admin));
  await menu('usuarios');
  await paso('asignar tipo a Demo Nuevo', async () => {
    const fila = page.locator('tr', { hasText: 'demo.nuevo@ort.edu.uy' });
    await elegir(fila.locator('select'), /Estudiante/i);
    await espera(800); await confirmar(); await mostrarMensaje();
  });
  await paso('crear usuario (queda con contraseña por defecto)', async () => {
    await page.locator('#nuevoDni').scrollIntoViewIfNeeded();
    await escribir('#nuevoDni', '48765438'); await escribir('#nuevoNombre', 'Ana'); await escribir('#nuevoApellido', 'Prueba'); await escribir('#nuevoEmail', 'ana.prueba@ort.edu.uy');
    await elegir(page.locator('#nuevoTipo'), /Docente/i);
    await clic(page.locator('#crear')); await mostrarMensaje();
  });
  await paso('desactivar a Joaquín', async () => {
    const fila = page.locator('tr', { hasText: 'joaquin.ramos@ort.edu.uy' });
    await clic(fila.getByRole('button', { name: /Desactivar/ })); await espera(800); await confirmar(); await espera(1500);
  });
  await menu('tipos-usuario');
  await paso('descripción > 100 caracteres, imagen, topes', async () => {
    // el campo tiene maxlength=100: se muestra que corta; luego se guarda una válida
    const desc = page.locator('#descripcion-3');
    await desc.scrollIntoViewIfNeeded(); await desc.fill('x'.repeat(130)); await espera(1800);
    await escribir('#descripcion-3', 'Docentes: pueden pedir equipamiento de cualquier catálogo');
    const img = require('path').resolve('docente.png');
    if (fs.existsSync(img)) await page.locator('#imagen-3').setInputFiles(img);
    await espera(1200);
    await escribir('#unidades-3', '2'); await escribir('#concurrentes-3', '3'); await espera(800);
    await clic(page.getByRole('button', { name: /Guardar/ }).nth(2)); await mostrarMensaje();
    await page.locator('#imagen-3').scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 200); await espera(1500); await foto(); await espera(1300); // se ve el tipo ya guardado, con imagen, descripción y topes
  });
  await paso('desactivado no ingresa', () => intentarIngreso(U.joaquin));
  await paso('primer ingreso: cambio de contraseña', async () => {
    await ingresar(['ana.prueba@ort.edu.uy', 'Cambiar1']); await espera(1500);
    // la app debe llevar a cambiar contraseña; por si no, se entra por el menú
    if (!page.url().includes('cambiar-contrasenia')) await clic(page.locator('nav a[href="cambiar-contrasenia"]'));
    await page.waitForLoadState('networkidle'); await espera(1000);
    await escribir('#actual', 'Incorrecta1'); await escribir('#nueva', 'Nueva1234');
    await clic(page.getByRole('button', { name: 'Cambiar' })); await mostrarMensaje();
    await escribir('#actual', 'Cambiar1'); await escribir('#nueva', 'debil');
    await clic(page.getByRole('button', { name: 'Cambiar' })); await mostrarMensaje();
    await escribir('#actual', 'Cambiar1'); await escribir('#nueva', 'Nueva1234');
    await clic(page.getByRole('button', { name: 'Cambiar' })); await mostrarMensaje();
  });

  await paso('Demo Nuevo ya es Estudiante: ve solo las opciones de su tipo', async () => { await ingresar(['demo.nuevo@ort.edu.uy', 'Demo1234']); await espera(3500); });

  // ───────── 3. Catálogos ─────────
  bloque('3. Gestión de catálogos');
  await paso('login supervisor', () => ingresar(U.supervisor));
  await menu('catalogo'); // "Catálogo" (consulta) vs configurar: se resuelve abajo
  await paso('ir a Configurar catálogos', async () => {
    const cfg = page.locator('nav a', { hasText: 'Configurar catálogos' }); await clic(cfg); await page.waitForLoadState('networkidle'); await espera(1200);
  });
  const crearCat = async (n) => { await escribir('#nombreNuevo', n); await clic(page.getByRole('button', { name: 'Crear' })); await mostrarMensaje(); };
  await paso('catálogo nombre corto', () => crearCat('ab'));
  await paso('catálogo nombre repetido', () => crearCat('Audiovisual'));
  await paso('catálogo Robótica', () => crearCat('Robótica'));
  await paso('renombrar Robótica', async () => {
    await clic(page.locator('.list-group-item', { hasText: 'Robótica' }));
    await escribir('#nombreCatalogo', 'Robótica y Mecatrónica'); await clic(page.getByRole('button', { name: 'Guardar nombre' })); await mostrarMensaje();
  });
  await paso('baja de catálogo con préstamos (rechazo)', async () => {
    await clic(page.locator('.list-group-item', { hasText: 'Laboratorio de Electrónica' }));
    await clic(page.getByRole('button', { name: 'Dar de baja' })); await espera(700); await confirmar(); await mostrarMensaje();
  });
  await paso('baja de catálogo vacío', async () => {
    await clic(page.locator('.list-group-item', { hasText: 'Robótica' }));
    await clic(page.getByRole('button', { name: 'Dar de baja' })); await espera(700); await confirmar(); await mostrarMensaje();
  });
  await paso('Docente no ve Configurar catálogos', async () => {
    await ingresar(U.docente);
    const n = await page.locator('nav a', { hasText: 'Configurar catálogos' }).count();
    console.log('  docente ve "Configurar catálogos":', n > 0); await espera(2500);
  });

  // ───────── 4. Tipos de equipamiento y unidades ─────────
  bloque('4. Tipos de equipamiento y unidades');
  await paso('login supervisor', () => ingresar(U.supervisor));
  await paso('ir a Configurar catálogos', async () => { await clic(page.locator('nav a', { hasText: 'Configurar catálogos' })); await page.waitForLoadState('networkidle'); await espera(1200); });
  await paso('registrar tipo en Audiovisual', async () => {
    await clic(page.locator('.list-group-item', { hasText: 'Audiovisual' }));
    await clic(page.getByRole('button', { name: 'Registrar tipo' })); await espera(800);
    await escribir('#nombre', 'ab'); await escribir('#duracion', '3');
    await clic(page.getByRole('button', { name: 'Registrar', exact: true })); await mostrarMensaje(); // nombre inválido
    await escribir('#nombre', 'Trípode Manfrotto'); await escribir('#descripcion', 'Trípode de aluminio para cámara');
    await clic(page.getByRole('button', { name: 'Registrar', exact: true })); await mostrarMensaje();
  });
  await paso('mismo nombre en otro catálogo = otro tipo', async () => {
    await clic(page.locator('.list-group-item', { hasText: 'Laboratorio de Electrónica' })); await espera(1800);
    await clic(page.locator('.list-group-item', { hasText: 'Audiovisual' })); await espera(1800);
  });
  await paso('login funcionario', () => ingresar(U.funcionario));
  await menu('unidades');
  const regUnidad = async (id) => { await escribir('#identificacion', id); await escribir('#ubicacion', 'Pañol audiovisual'); await clic(page.getByRole('button', { name: 'Registrar', exact: true })); await mostrarMensaje(); };
  await paso('elegir catálogo y tipo', async () => { await elegir(page.locator('#selectorCatalogo'), /Audiovisual/); await espera(1000); await elegir(page.locator('#tipo'), /Proyector/); await espera(1200); });
  await paso('unidad id con formato inválido', () => regUnidad('XX1'));
  await paso('unidad id duplicada', () => regUnidad('PRY-0001'));
  await paso('unidad válida', () => regUnidad('PRY-0004'));
  await paso('unidad a mantenimiento', async () => {
    const fila = page.locator('tr', { hasText: 'PRY-0004' }); await elegir(fila.locator('select'), /mantenimiento/i); await espera(1500);
  });
  await paso('baja de unidad disponible', async () => {
    const fila = page.locator('tr', { hasText: 'PRY-0003' });
    await clic(fila.getByRole('button', { name: /baja/i })); await espera(700); await confirmar(); await mostrarMensaje();
  });
  await paso('unidad dada de baja no vuelve a estar disponible', async () => {
    await elegir(page.locator('#tipo'), /Proyector/); await espera(1200);
    const fila = page.locator('tr', { hasText: 'PRY-0003' }); await fila.scrollIntoViewIfNeeded(); await espera(1800);
    const sel = fila.locator('select');
    if (await sel.count()) { await sel.selectOption({ label: 'Disponible' }).catch(() => {}); await espera(1200); }
    await foto(); await espera(1500);
  });
  await paso('baja a unidad prestada (rechazo)', async () => {
    await elegir(page.locator('#tipo'), /Cámara/); await espera(1200);
    const fila = page.locator('tr', { hasText: 'CAM-0001' });
    const btn = fila.getByRole('button', { name: /baja/i });
    if (await btn.count()) { await clic(btn); await espera(700); await confirmar(); await mostrarMensaje(); } else console.log('  (sin botón de baja para prestada: la UI ya lo impide)');
  });

  // ───────── 5. Consulta y solicitud ─────────
  bloque('5. Consulta del catálogo y solicitud de préstamo');
  await paso('login docente', () => ingresar(U.docente));
  await menu('tipos'); // Catálogo de equipamiento (ruta /tipos)
  await paso('catálogo y filtros', async () => {
    await elegir(page.locator('#selectorCatalogo'), /Audiovisual/); await espera(1500);
    await elegir(page.locator('#filtroCategoria'), /Audio|Video|Imagen/i).catch(() => {});
    await escribir('#filtroCantidad', '1'); await clic(page.getByRole('button', { name: 'Buscar' })); await espera(2000);
  });
  await menu('prestamos');
  await paso('solicitar sin aprobación (Proyector)', async () => {
    await elegir(page.locator('#selectorCatalogo'), /Audiovisual/); await espera(800);
    await elegir(page.locator('#tipo'), /Proyector/); await escribir('#cantidad', '1');
    await clic(page.getByRole('button', { name: 'Solicitar' })); await mostrarMensaje();
  });
  await paso('solicitar con aprobación (Cámara)', async () => {
    await elegir(page.locator('#tipo'), /Cámara/); await escribir('#cantidad', '1');
    await clic(page.getByRole('button', { name: 'Solicitar' })); await mostrarMensaje();
  });
  await paso('superar tope de unidades por catálogo', async () => {
    await elegir(page.locator('#tipo'), /Micrófono/); await escribir('#cantidad', '9');
    await clic(page.getByRole('button', { name: 'Solicitar' })); await mostrarMensaje();
  });
  await paso('ver Mis solicitudes', async () => { await clic(page.locator('nav a[href=""]').first()); await page.waitForLoadState('networkidle'); await espera(2500); await foto(); await espera(1500); });

  // ───────── 6. Aprobaciones ─────────
  bloque('6. Aprobar y rechazar');
  await paso('login supervisor', () => ingresar(U.supervisor));
  await menu('aprobaciones');
  await paso('aprobar solicitud de Valentina', async () => { await clic(page.locator('tr', { hasText: 'Valentina' }).getByRole('button', { name: /Aprobar/ })); await mostrarMensaje(); });
  await paso('rechazar con motivo', async () => {
    await clic(page.locator('tr', { hasText: 'Diego' }).getByRole('button', { name: /Rechazar/ })); await espera(700);
    await escribir('#motivo', 'No hay stock suficiente para esa fecha');
    await clic(page.getByRole('button', { name: 'Confirmar rechazo' })); await mostrarMensaje();
  });
  await paso('la docente ve el resultado', async () => { await ingresar(U.docente); await espera(3000); });

  // ───────── 7. Devoluciones e inventario ─────────
  bloque('7. Devoluciones, inventario e histórico');
  await paso('login funcionario', () => ingresar(U.funcionario));
  await menu('devoluciones');
  await paso('devolución con fecha anterior (rechazo)', async () => {
    await page.locator('#fecha').fill('2020-01-01'); await espera(600);
    await clic(page.getByRole('button', { name: /Registrar devolución/ }).first()); await mostrarMensaje();
  });
  await paso('devolver sin observaciones (Lucía, osciloscopio)', async () => {
    await page.locator('#fecha').fill(new Date().toISOString().slice(0, 10));
    await clic(page.locator('tr', { hasText: 'Lucía' }).getByRole('button', { name: /Registrar devolución/ })); await mostrarMensaje();
  });
  await paso('devolver dañada (Mateo, cámara)', async () => {
    const fila = page.locator('tr', { hasText: 'Mateo' });
    await elegir(fila.locator('select').first(), /Dañada/i); await espera(700);
    await escribir('#observaciones', 'Lente rayado, requiere revisión');
    await foto(); await espera(1500); // se ve la condición elegida y la observación antes de confirmar
    await clic(fila.getByRole('button', { name: /Registrar devolución/ })); await mostrarMensaje();
  });
  await menu('inventario');
  await paso('inventario Audiovisual (cámara en mantenimiento)', async () => { await elegir(page.locator('#selectorCatalogo'), /Audiovisual/); await page.evaluate(() => (document.querySelector('article') || document.body).style.zoom = '0.8'); await espera(2500); await foto(); await espera(1500); });
  await paso('inventario Electrónica (osciloscopio disponible)', async () => { await elegir(page.locator('#selectorCatalogo'), /Electrónica/); await espera(2500); await foto(); await espera(1500); await page.evaluate(() => (document.querySelector('article') || document.body).style.zoom = ''); });
  await paso('login supervisor (el Funcionario no tiene histórico)', () => ingresar(U.supervisor));
  await menu('historico');
  await paso('histórico Audiovisual', async () => { await elegir(page.locator('#selectorCatalogo'), /Audiovisual/).catch(() => {}); await espera(2500); await foto(); await espera(1500); });

  // ───────── 8. Notificaciones ─────────
  bloque('8. Notificaciones');
  await paso('login Mateo (aprobada y rechazada)', async () => { await ingresar(U.estudiante2); await espera(3000); await foto(); await espera(1500); });
  await paso('marcar como leída', async () => { await clic(page.getByRole('button', { name: 'Marcar como leída' }).first()); await espera(1800); await foto(); await espera(1500); });
  await paso('login Camila (préstamo vencido)', async () => { await ingresar(U.estudiante3); await espera(3000); await foto(); await espera(1500); });

  // ───────── 9. Auditoría y exportación ─────────
  bloque('9. Auditoría y exportación');
  await paso('login admin', () => ingresar(U.admin));
  await menu('auditoria');
  await paso('registros (se recorre el log)', async () => {
    await espera(1500); await foto();
    for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 380); await espera(1500); await foto(); }
    await page.mouse.wheel(0, -2000); await espera(800);
  });
  await paso('filtrar por usuario y fechas', async () => {
    await escribir('#usuario', 'lucia.silva@ort.edu.uy'); await page.locator('#desde').fill('2026-11-01'); await page.locator('#hasta').fill('2026-12-31');
    await clic(page.locator('#filtrar')); await espera(2000); await foto(); await espera(1500);
    await clic(page.locator('#limpiar')); await espera(1000);
  });
  await menu('exportar');
  await paso('exportar CSV y XLSX', async () => {
    await page.locator('#desde').fill('2026-10-01'); await page.locator('#hasta').fill('2026-12-31');
    for (const id of ['#exportarCsv', '#exportarXlsx']) {
      const [d] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), clic(page.locator(id))]);
      const dest = `salida/${d.suggestedFilename()}`; await d.saveAs(dest); console.log('  descargado', dest); await espera(1500);
      const { execFileSync } = require('child_process');
      const txt = dest.endsWith('.xlsx') ? execFileSync('python3', ['xlsx2txt.py', dest]).toString() : fs.readFileSync(dest, 'utf8');
      await verArchivo(`Contenido de ${require('path').basename(dest)}`, txt.split('\n').slice(0, 26).join('\n'));
    }
  });

  // ───────── 10. Límites integrados ─────────
  bloque('10. Límites entre catálogos');
  await paso('login docente', () => ingresar(U.docente));
  await menu('prestamos');
  const pedir = async (cat, tipo, cant) => {
    await elegir(page.locator('#selectorCatalogo'), cat); await espera(700);
    await elegir(page.locator('#tipo'), tipo); await escribir('#cantidad', String(cant));
    await clic(page.getByRole('button', { name: 'Solicitar' })); await mostrarMensaje();
  };
  await paso('no se pueden mezclar catálogos: cada solicitud ofrece solo los tipos de su catálogo', async () => {
    const listar = async (cat) => { await elegir(page.locator('#selectorCatalogo'), cat); await espera(800); return (await page.locator('#tipo option').allTextContents()).join('\n'); };
    const a = await listar(/Audiovisual/), e = await listar(/Electrónica/);
    await verArchivo('Tipos que ofrece una solicitud según el catálogo elegido', 'Catálogo Audiovisual:\n' + a + '\n\nCatálogo Laboratorio de Electrónica:\n' + e + '\n\n(una solicitud pertenece a un único catálogo: no se pueden mezclar unidades de catálogos distintos)');
  });
  await paso('superar unidades por catálogo (Audiovisual ya tiene 2)', () => pedir(/Audiovisual/, /Micr[oó]fono/, 1));
  await paso('solicitud en otro catálogo (Electrónica)', () => pedir(/Electrónica/, /Notebook/, 1));
  await paso('superar préstamos concurrentes con un tercer catálogo (Biotecnología)', () => pedir(/Biotecnolog/, /Microscopio/, 1));
  await paso('baja de catálogo con préstamos (rechazo)', async () => {
    await ingresar(U.supervisor);
    await clic(page.locator('nav a', { hasText: 'Configurar catálogos' })); await page.waitForLoadState('networkidle'); await espera(1000);
    await clic(page.locator('.list-group-item', { hasText: 'Biotecnología' }));
    await clic(page.getByRole('button', { name: 'Dar de baja' })); await espera(700); await confirmar(); await mostrarMensaje();
  });

  bloque('FIN');
  await espera(2000);
  const video = await page.video().path();
  await ctx.close(); await browser.close();
  fs.writeFileSync('salida/tiempos.txt', tiempos.join('\n') + '\n\nFALLAS:\n' + (fallas.join('\n') || '(ninguna)') + '\n');
  console.log('\nVideo:', video, '\nTiempos y fallas: salida/tiempos.txt');
})();
