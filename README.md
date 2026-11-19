# Demo muda de UCD con Playwright

Graba la demo funcional del Obligatorio 2 de DA1 (UCD) sin tocar el mouse: abre la app, hace los 10 bloques del guion y deja un `.webm` para que después se le agregue la voz.

En el video se ve un cursor, un recuadro rojo sobre lo que se va a tocar y un pie con **qué hacemos** y **qué demuestra** en cada paso.

## Requisitos
- Node 18+ y `npm install` (instala `playwright` y `mssql`).
- `npx playwright install chromium`
- Python 3 (para mostrar el contenido del XLSX exportado) y `ffmpeg` (opcional, para convertir a MP4).
- El repo de UCD clonado, con Docker corriendo (`docker compose up -d`) y .NET 8.

## Uso
```sh
export UCD_DIR=~/Proyectos/UCD          # carpeta del repo de UCD
./reset.sh                              # base limpia + datos de prueba
(cd $UCD_DIR && dotnet run --project src/UCD.WebApp --urls http://localhost:5099) &
caffeinate -dimsu node demo.js          # graba en ./salida (video, capturas y tiempos)
```
- `RITMO` escala las pausas (por defecto 0.8; ≈12 min de video). `RITMO=0.3 SLOWMO=0 node demo.js` hace una corrida rápida para probar cambios.
- `VER=1` abre el navegador visible.
- `TRAZA=1` imprime cada paso al empezar.
- Antes de cada grabación hay que correr `./reset.sh`: la demo modifica la base.

## Salida
- `salida/*.webm`: el video. `salida/tiempos.txt`: minuto de cada bloque y pasos que fallaron.
- `capturas/`: una captura por cada mensaje de error o éxito, útil para revisar que se mostró lo que se quería.

## Archivos
- `demo.js`: el guion de la demo (bloques y pasos).
- `overlay.js`: cursor, recuadro y pie. Acá están los textos de **qué hacemos / qué demuestra** de cada paso; editarlos cambia el pie del video.
- `guion.md` / `guion-narracion.md`: guion con perfiles, pantallas y qué requerimiento cubre cada bloque.
- `cargar-datos.js`, `reset.sh`: restauran la base de datos de prueba.
- `xlsx2txt.py`: lee el XLSX exportado para mostrarlo en pantalla.
- `docente.png`: imagen de prueba que se sube al tipo Docente.

## Notas
- La sesión de la app vive en el circuito de Blazor: se navega con clics del menú; `page.goto` equivale a cerrar sesión.
- Las cédulas deben ser válidas (dígito verificador uruguayo), por eso `47654325` y `48765438`.
- Las cuentas y contraseñas son las de los datos de prueba del proyecto (`Clave2026`; root: `Root1234`).
