/**
 * Distribuidora Automotriz JARI — Registro de clientes
 * Este código recibe los registros de la página web y los guarda
 * en tu hoja de Google (Excel), asignando un número de cliente y la fecha.
 *
 * Cómo usarlo: ver el archivo INSTRUCCIONES.md
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // evita que dos registros choquen al mismo tiempo
  try {
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Si la hoja está vacía, escribe los títulos de las columnas
    if (hoja.getLastRow() === 0) {
      hoja.appendRow([
        'N° Cliente', 'Fecha de registro', 'Nombre', 'Teléfono',
        'Dirección', 'Código Postal', 'Ciudad', 'Estado',
        'Productos de interés', 'Qué espera al contactarnos'
      ]);
    }

    var d = e.parameter;

    // El número de cliente empieza en 1001 y sube de uno en uno
    var numCliente = 1000 + hoja.getLastRow();
    var fecha = new Date();

    hoja.appendRow([
      numCliente,
      fecha,
      d.nombre || '',
      d.telefono || '',
      d.direccion || '',
      d.cp || '',
      d.ciudad || '',
      d.estado || '',
      d.productos || '',
      d.esperas || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, numCliente: numCliente }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Permite abrir la URL en el navegador para comprobar que funciona
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, mensaje: 'Servicio JARI activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}
