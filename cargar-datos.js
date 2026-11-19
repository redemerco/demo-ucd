const sql = require('mssql'), fs = require('fs');
(async () => {
  const pool = await sql.connect({ server: 'localhost', port: 1433, user: 'sa', password: 'Passw1rd', database: 'UCD', options: { trustServerCertificate: true }, requestTimeout: 60000 });
  const script = fs.readFileSync((process.env.UCD_DIR || process.env.HOME + '/Proyectos/UCD') + '/base-de-datos/UCD-datos-prueba.sql', 'utf8');
  for (const lote of script.split(/^\s*GO\s*$/mi).filter(l => l.trim())) await pool.request().batch(lote);
  const r = await pool.request().query('select count(*) n from Usuarios'); console.log('usuarios', r.recordset[0].n);
  await pool.close();
})().catch(e => { console.error(e.message); process.exit(1); });
