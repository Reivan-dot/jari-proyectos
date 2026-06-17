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
      'Productos de interés', 'Qué espera al contactarnos', 'Token', 'Perfil'
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
      // Lee hasta la columna O (15) = Perfil. (N°, fecha, nombre, correo, contraseña ... perfil)
      var filasL = hoja.getRange(2, 1, ultimoL - 1, 15).getValues();
      for (var k = 0; k < filasL.length; k++) {
        if (String(filasL[k][0]) === String(num) && String(filasL[k][4]) === String(pass)) {
          return json({ ok: true, nombre: filasL[k][2], perfil: String(filasL[k][14] || '') });
        }
      }
      return json({ ok: false, error: 'Número o contraseña incorrectos.' });
    }

    // ---------- GUARDAR PEDIDO (para el historial del cliente) ----------
    if (accion === 'guardarPedido') {
      var hojaPed = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Pedidos');
      if (!hojaPed) hojaPed = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Pedidos');
      if (hojaPed.getLastRow() === 0) {
        hojaPed.appendRow(['Fecha', 'N° Cliente', 'Nombre', 'Detalle', 'Total', 'Códigos']);
      }
      hojaPed.appendRow([
        new Date(), d.numero || '', d.nombre || '',
        d.detalle || '', Number(d.total) || 0, d.codigos || ''
      ]);
      return json({ ok: true });
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

  // ---------- ENTREGAR EL CATÁLOGO DE PRODUCTOS ----------
  if (p.accion === 'catalogo') {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Productos');
    if (!sh) return json({ ok: false, error: 'No existe una hoja llamada "Productos".' });
    var ultimo = sh.getLastRow();
    var productos = [];
    if (ultimo >= 2) {
      // Columnas: codigo | nombre | descripcion | precio | medida | imagen
      var vals = sh.getRange(2, 1, ultimo - 1, 6).getValues();
      for (var i = 0; i < vals.length; i++) {
        var r = vals[i];
        if (r[0] === '' && r[1] === '') continue; // salta filas vacías
        productos.push({
          codigo: String(r[0]),
          nombre: r[1],
          descripcion: r[2],
          precio: Number(r[3]) || 0,
          medida: r[4],
          img: String(r[5])
        });
      }
    }
    return json({ ok: true, productos: productos });
  }

  // ---------- CÓDIGOS SUGERIDOS POR PERFIL ----------
  if (p.accion === 'sugerencias') {
    var perfil = (p.perfil || '').trim().toLowerCase();
    if (!perfil) return json({ ok: true, codigos: [] });
    var shPer = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Perfiles');
    if (!shPer) return json({ ok: false, error: 'No existe una hoja llamada "Perfiles".' });
    var ultPer = shPer.getLastRow();
    var codigos = [];
    if (ultPer >= 2) {
      // Columnas: perfil | codigos (códigos separados por coma)
      var valsPer = shPer.getRange(2, 1, ultPer - 1, 2).getValues();
      for (var j = 0; j < valsPer.length; j++) {
        if (String(valsPer[j][0]).trim().toLowerCase() === perfil) {
          String(valsPer[j][1]).split(',').forEach(function (c) {
            c = c.trim(); if (c) codigos.push(c);
          });
        }
      }
    }
    return json({ ok: true, codigos: codigos });
  }

  // ---------- CÓDIGOS QUE EL CLIENTE YA PIDIÓ ANTES ----------
  if (p.accion === 'pedidos') {
    var numClt = (p.numero || '').trim();
    if (!numClt) return json({ ok: true, codigos: [] });
    var shPed = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Pedidos');
    if (!shPed) return json({ ok: true, codigos: [] });
    var ultPed = shPed.getLastRow();
    var vistos = {}, listaCod = [];
    if (ultPed >= 2) {
      // Columnas: Fecha | N° Cliente | Nombre | Detalle | Total | Códigos
      var valsPed = shPed.getRange(2, 2, ultPed - 1, 5).getValues(); // desde col B
      for (var m = valsPed.length - 1; m >= 0; m--) { // del más reciente al más viejo
        if (String(valsPed[m][0]).trim() === numClt) {
          String(valsPed[m][4]).split(',').forEach(function (c) {
            c = c.trim();
            if (c && !vistos[c]) { vistos[c] = true; listaCod.push(c); }
          });
        }
      }
    }
    return json({ ok: true, codigos: listaCod });
  }

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
