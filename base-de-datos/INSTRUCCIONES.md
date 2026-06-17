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
N° Cliente · Fecha de registro · Nombre · Teléfono · Dirección · Código Postal ·
Ciudad · Estado · Productos de interés · Qué espera al contactarnos

> Nota: si cambias el código más adelante, debes volver a **Implementar → Administrar
> implementaciones → Editar → Nueva versión** para que los cambios tomen efecto.
