import sys, zipfile, re
from xml.etree import ElementTree as ET
ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
z = zipfile.ZipFile(sys.argv[1])
ss = []
if 'xl/sharedStrings.xml' in z.namelist():
    for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', ns):
        ss.append(''.join(t.text or '' for t in si.iter('{%s}t' % ns['m'])))
hojas = sorted(n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml'))
wb = ET.fromstring(z.read('xl/workbook.xml'))
nombres = [h.get('name') for h in wb.iter('{%s}sheet' % ns['m'])]
for idx, hoja in enumerate(hojas):
  print(nombres[idx] if idx < len(nombres) else hoja)
  sheet = ET.fromstring(z.read(hoja))
  for row in sheet.iter('{%s}row' % ns['m']):
      vals = []
      for c in row.findall('m:c', ns):
          v = c.find('m:v', ns); i = c.find('m:is', ns)
          if c.get('t') == 's' and v is not None: vals.append(ss[int(v.text)])
          elif i is not None: vals.append(''.join(t.text or '' for t in i.iter('{%s}t' % ns['m'])))
          else: vals.append(v.text if v is not None else '')
      print(' | '.join(vals))
