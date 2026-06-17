/**
 * Distribuidora Automotriz JARI — Registro de clientes
 * Guarda los registros en tu hoja de Google (Excel), valida que el correo
 * no se repita, envía correo de verificación y permite recuperar el número
 * de cliente y la contraseña por correo.
 *
 * Cómo usarlo: ver el archivo INSTRUCCIONES.md
 *
 * Columnas de la hoja (en este orden):
 * N° Cliente | Fecha de registro | Nombre | Correo | Contraseña | Verificado |
 * Teléfono | Dirección | Código Postal | Ciudad | Estado |
 * Productos de interés | Qué espera al contactarnos | Token
 */

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * EJECUTA ESTA FUNCIÓN UNA VEZ para conceder el permiso de enviar correos.
 * Selecciónala en el menú de funciones (arriba) y pulsa "Ejecutar".
 * Google te pedirá autorizar el envío de correo: acepta.
 * Te llegará un correo de prueba a tu propia cuenta.
 */
function autorizar() {
  var correo = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail(correo, 'Permisos JARI OK ✅',
    'Si recibes este correo, el envío de correos ya quedó autorizado. ¡Listo!');
}

function asegurarEncabezados(hoja) {
  if (hoja.getLastRow() === 0) {
    hoja.appendRow([
      'N° Cliente', 'Fecha de registro', 'Nombre', 'Correo', 'Contraseña', 'Verificado',
      'Teléfono', 'Dirección', 'Código Postal', 'Ciudad', 'Estado',
      'Productos de interés', 'Qué espera al contactarnos', 'Token'
    ]);
  }
}

// Devuelve el número de fila si el correo ya existe, o -1 si no
function buscarFilaPorCorreo(hoja, correo) {
  var ultimo = hoja.getLastRow();
  if (ultimo < 2) return -1;
  var valores = hoja.getRange(2, 4, ultimo - 1, 1).getValues(); // columna D = Correo
  for (var i = 0; i < valores.length; i++) {
    if (String(valores[i][0]).trim().toLowerCase() === correo) return i + 2;
  }
  return -1;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    asegurarEncabezados(hoja);

    var d = e.parameter;
    var accion = d.accion || 'registro';

    // ---------- INICIAR SESIÓN (número + contraseña) ----------
    if (accion === 'login') {
      var num = (d.numero || '').trim();
      var pass = (d.password || '');
      if (!num || !pass) return json({ ok: false, error: 'Faltan datos.' });
      var ultimoL = hoja.getLastRow();
      if (ultimoL < 2) return json({ ok: false, error: 'Número o contraseña incorrectos.' });
      var filasL = hoja.getRange(2, 1, ultimoL - 1, 5).getValues(); // N°, fecha, nombre, correo, contraseña
      for (var k = 0; k < filasL.length; k++) {
        if (String(filasL[k][0]) === String(num) && String(filasL[k][4]) === String(pass)) {
          return json({ ok: true, nombre: filasL[k][2] });
        }
      }
      return json({ ok: false, error: 'Número o contraseña incorrectos.' });
    }

    // ---------- RECUPERAR NÚMERO Y CONTRASEÑA ----------
    if (accion === 'recuperar') {
      var correoR = (d.correo || '').trim().toLowerCase();
      if (!correoR) return json({ ok: false, error: 'Escribe tu correo.' });
      var fila = buscarFilaPorCorreo(hoja, correoR);
      if (fila < 0) return json({ ok: false, error: 'No encontramos ese correo registrado.' });

      var datos = hoja.getRange(fila, 1, 1, 5).getValues()[0];
      var numC = datos[0], nombreC = datos[2], passC = datos[4];
      MailApp.sendEmail({
        to: correoR,
        subject: 'Tu número de cliente — Distribuidora Automotriz JARI',
        htmlBody:
          '<p>Hola ' + nombreC + ',</p>' +
          '<p>Tu <b>número de cliente</b> es: <b>' + numC + '</b></p>' +
          '<p>Tu <b>contraseña</b> es: <b>' + passC + '</b></p>' +
          '<p>— Distribuidora Automotriz JARI</p>'
      });
      return json({ ok: true, mensaje: 'Listo, te enviamos tu número y contraseña a tu correo.' });
    }

    // ---------- REGISTRO ----------
    var correo = (d.correo || '').trim().toLowerCase();
    if (!correo) return json({ ok: false, error: 'Falta el correo electrónico.' });

    // Validar que el correo NO esté repetido
    if (buscarFilaPorCorreo(hoja, correo) > 0) {
      return json({ ok: false, error: 'Este correo ya está registrado. Usa otro o recupera tu número.' });
    }

    var numCliente = 1000 + hoja.getLastRow(); // primer cliente = 1001
    var fecha = new Date();
    var token = Utilities.getUuid();

    hoja.appendRow([
      numCliente, fecha, d.nombre || '', correo, d.password || '', 'No',
      d.telefono || '', d.direccion || '', d.cp || '', d.ciudad || '', d.estado || '',
      d.productos || '', d.esperas || '', token
    ]);

    // Enviar correo de verificación
    var urlVerif = ScriptApp.getService().getUrl() + '?accion=verificar&token=' + token;
    MailApp.sendEmail({
      to: correo,
      subject: 'Verifica tu correo — Distribuidora Automotriz JARI',
      htmlBody:
        '<p>Hola ' + (d.nombre || '') + ',</p>' +
        '<p>Gracias por registrarte. Tu <b>número de cliente</b> es <b>' + numCliente + '</b>.</p>' +
        '<p>Confirma tu correo haciendo clic aquí:</p>' +
        '<p><a href="' + urlVerif + '">✅ Verificar mi correo</a></p>' +
        '<p>— Distribuidora Automotriz JARI</p>'
    });

    return json({ ok: true, numCliente: numCliente });

  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Verificación del correo (cuando el cliente da clic en el enlace)
function doGet(e) {
  var p = e.parameter || {};
  if (p.accion === 'verificar' && p.token) {
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var ultimo = hoja.getLastRow();
    if (ultimo >= 2) {
      var tokens = hoja.getRange(2, 14, ultimo - 1, 1).getValues(); // columna N = Token
      for (var i = 0; i < tokens.length; i++) {
        if (String(tokens[i][0]) === p.token) {
          hoja.getRange(i + 2, 6).setValue('Sí'); // columna F = Verificado
          return HtmlService.createHtmlOutput(
            '<div style="font-family:Arial;text-align:center;padding:40px;">' +
            '<h2>✅ Correo verificado</h2>' +
            '<p>Gracias, tu correo quedó confirmado.</p>' +
            '<p><b>Distribuidora Automotriz JARI</b></p></div>');
        }
      }
    }
    return HtmlService.createHtmlOutput(
      '<div style="font-family:Arial;text-align:center;padding:40px;">' +
      '<h2>Enlace no válido</h2><p>No encontramos ese código de verificación.</p></div>');
  }
  return json({ ok: true, mensaje: 'Servicio JARI activo' });
}
