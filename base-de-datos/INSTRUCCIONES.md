# Cómo conectar el registro de clientes a Google Sheets (Excel)

Sigue estos pasos **una sola vez**. Al terminar, cada persona que se registre en la
página aparecerá automáticamente en tu hoja de Google, con su número de cliente y la fecha.

---

## Paso 1 — Crear la hoja de cálculo
1. Entra a **https://sheets.google.com** e inicia sesión con tu cuenta de Google.
2. Crea una hoja nueva (botón **+ En blanco**).
3. Ponle un nombre, por ejemplo: **Clientes JARI**.

## Paso 2 — Abrir el editor de código
1. En esa hoja, ve al menú **Extensiones → Apps Script**.
2. Se abre una ventana de código. Borra todo lo que tenga.
3. Abre el archivo **Codigo.gs** (de esta misma carpeta), **copia todo** y **pégalo** ahí.
4. Haz clic en el ícono de **guardar** (💾).

## Paso 3 — Publicar (implementar) el servicio
1. Arriba a la derecha, haz clic en **Implementar → Nueva implementación**.
2. En "Tipo", elige (engranaje ⚙️) **Aplicación web**.
3. Configura:
   - **Descripción:** Registro JARI (o lo que quieras)
   - **Ejecutar como:** Yo (tu correo)
   - **Quién tiene acceso:** **Cualquier persona**  ← MUY IMPORTANTE
4. Haz clic en **Implementar**.
5. Te pedirá **autorizar permisos**: acepta con tu cuenta (si sale un aviso de
   "Google no verificó la app", entra en **Configuración avanzada → Ir a (tu proyecto)**
   y permite el acceso).
6. Al final te dará una **URL de la aplicación web** (termina en `/exec`). **Cópiala.**

## Paso 4 — Conectarla con la página
Mándame esa URL por aquí y yo la pego en la página, o tú mismo:
1. Abre el archivo `index.html`.
2. Busca la línea:  `const SCRIPT_URL = 'PEGA_AQUI_LA_URL_DE_GOOGLE';`
3. Reemplaza `PEGA_AQUI_LA_URL_DE_GOOGLE` por tu URL (entre las comillas).
4. Guarda y sube el cambio.

---

## ¿Cómo veo los registros en Excel?
- Solo abre tu hoja **Clientes JARI** en Google Sheets: cada registro es una fila.
- Para descargarla como Excel: **Archivo → Descargar → Microsoft Excel (.xlsx)**.

## Columnas que se guardan

| Col | Nombre | Quién llena |
|-----|--------|-------------|
| A | N° Usuario | Automático (1001, 1002…) — con el que el cliente inicia sesión |
| B | Fecha de registro | Automático |
| C | Nombre | El cliente al registrarse |
| D | Correo | El cliente |
| E | Contraseña | El cliente |
| F | Verificado | Automático (Sí / No) |
| G | Teléfono | El cliente |
| H | Dirección | El cliente |
| I | Código Postal | El cliente |
| J | Ciudad | El cliente |
| K | Estado | El cliente |
| L | Productos de interés | El cliente |
| M | Qué espera al contactarnos | El cliente |
| N | Token | Automático (verificación de correo) |
| O | Perfil | **Tú** (define qué sugerencias verá en la tienda) |
| P | N° Cliente | **Tú** a mano — ⚠️ **sin este número el cliente NO puede ver los precios** |
| Q | Vendedor | **Tú** — escribe el nombre del vendedor asignado |
| R | Frecuencia de entradas | Automático — cuántas veces entró a la tienda |
| S | Frecuencia de compras | Automático — cuántos pedidos envió por WhatsApp |
| T | Usos carga Excel | Automático — veces que usó "Cargar pedido" desde Excel |
| U | Envío: Dirección | El cliente (botón "🚚 Instrucciones de envío") |
| V | Envío: Referencias | El cliente |
| W | Envío: Entre calles | El cliente |
| X | Envío: C.P. | El cliente |
| Y | Envío: Paquetería | El cliente |
| Z | Envío: Convenio paquetería | El cliente |

> **Datos de envío (U–Z):** el cliente los captura una vez desde la tienda (botón
> **🚚 Instrucciones de envío**) y se guardan solos en estas columnas. Sirven para
> coordinar la entrega y aparecen también en el mensaje de WhatsApp del pedido.

> **Proporción entradas/compras:** puedes ver qué tan seguido el cliente pide vs. cuántas
> veces entra. Para calcularlo en la misma hoja, añade una columna libre (por ejemplo AA)
> con la fórmula `=SI(S2=0,"—",TEXTO(R2/S2,"0.0")&" visitas/pedido")` y cópiala hacia abajo.

---

## ⚠️ Si ya tenías el código anterior (ACTUALIZACIÓN)
Como ahora se agregaron columnas nuevas (Vendedor, Frecuencia de entradas, Frecuencia de compras), haz esto:

1. **Vacía la hoja:** borra TODAS las filas que tenga (incluida la de títulos y los
   registros de prueba). La hoja debe quedar completamente vacía: así el código
   crea de nuevo los títulos correctos en el orden nuevo.
2. **Reemplaza el código:** en **Extensiones → Apps Script**, borra todo y pega de
   nuevo el contenido actualizado de `Codigo.gs`. Guarda (💾).
3. **Vuelve a publicar:** **Implementar → Administrar implementaciones →** (lápiz ✏️
   Editar) **→ Versión: Nueva versión → Implementar**.
   La URL **NO cambia**, sigue siendo la misma.
4. **Autoriza otra vez los permisos:** ahora el código envía correos, así que Google
   pedirá permiso para "enviar correo electrónico como tú". Acepta.

## Funciones nuevas
- **Correo de verificación:** al registrarse, el cliente recibe un correo con un
  enlace para confirmar su correo (se marca "Sí" en la columna *Verificado*).
- **Correo único:** no se puede registrar dos veces el mismo correo.
- **Recuperar número:** si el cliente olvida su número, escribe su correo en la
  página y recibe por correo su número de cliente y su contraseña.

> 🔒 Nota de seguridad: la contraseña se guarda tal cual en tu hoja (para poder
> reenviarla). No uses contraseñas importantes (de banco, etc.) aquí.
