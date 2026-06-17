# Catálogo automático y carga de las fotos (1000+ productos)

## Parte A — El catálogo (precios automáticos desde Google)

Los productos de la tienda se leen de tu hoja de Google. Cuando cambies un precio
ahí, la tienda se actualiza sola (en uno o dos minutos).

### Pasos
1. Abre la **misma hoja de Google** donde se guardan los clientes (Clientes JARI).
2. Abajo, crea una **pestaña nueva** y nómbrala exactamente: **`Productos`**
   (con P mayúscula).
3. En esa pestaña, pon estos títulos en la **fila 1**, una por columna (A a K):

   | A | B | C | D | E | F | G | H | I | J | K |
   |---|---|---|---|---|---|---|---|---|---|---|
   | codigo | nombre | descripcion | precio | medida | imagen | existencia | peso | medidas | oferta | precio_oferta |

4. Pega debajo TODOS tus productos (puedes copiar y pegar directo desde tu Excel
   PRECIOS.xlsx). Ejemplo:

   | codigo | nombre | descripcion | precio | medida | imagen | existencia | peso | medidas | oferta | precio_oferta |
   |--------|--------|-------------|--------|--------|--------|-----------|------|---------|--------|--------------|
   | 668 | FARO HORIZONTAL | Faro LED rect blanco 6 CREE LED | 45 | PAR | 668.png | 12 | 0.8 | 25x18x10 | remate | 35 |
   | 664 | AROMA CORCHO | Aroma corcho cherry en lata | 37 | PZ | 664.png | 0 | 0.2 | 8x8x12 |  |  |

   > **columna G `existencia`:** escribe la cantidad que tienes en almacén.
   > - Si pones un número mayor a 0, la tarjeta muestra **"✓ Existencia: 12"** en verde.
   > - Si pones **0**, muestra **"✗ Sin existencia"** en rojo.
   > - Si dejas la celda **vacía**, no se muestra nada (úsalo para productos sin control de stock).

   > **columna H `peso`:** peso del producto en **kilogramos** (ej. `0.8`). Se usa para
   > estimar el flete. Puedes dejarla vacía si aún no lo sabes.

   > **columna I `medidas`:** medidas de la caja en **centímetros**, en formato
   > `largo x ancho x alto` (ej. `25x18x10`). Se usa para el **peso volumétrico** del flete.

   > **columna J `oferta`:** marca el producto en una promoción escribiendo una de estas
   > palabras: **`remate`**, **`relampago`** o **`mes`** (también acepta "Remates",
   > "Relámpago", "Oferta del mes"…). Aparecerá en la sección correspondiente con su
   > insignia. Déjala vacía si el producto no está en oferta.

   > **columna K `precio_oferta`:** precio rebajado (ej. `35`). Si es **menor** al precio
   > normal, la tarjeta muestra el precio normal tachado y el de oferta en rojo, y ese es
   > el precio que se cobra. Si la dejas vacía, solo se usa para agrupar (sin descuento).

5. Vuelve a publicar el Apps Script una vez (**Implementar → Administrar
   implementaciones → ✏️ Editar → Versión: Nueva versión → Implementar**).
   *(La columna `imagen` debe tener el nombre EXACTO del archivo de la foto.)*

¡Listo! La tienda mostrará automáticamente todos los productos de esa pestaña.

---

## Parte B — Subir las fotos (más de 1000) de forma rápida

Subir mil fotos una por una en la web de GitHub es muy lento. La mejor forma es
**GitHub Desktop** (programa gratis), que sube una carpeta completa de un jalón.

### Opción recomendada: GitHub Desktop
1. Descarga **GitHub Desktop**: https://desktop.github.com  (instálalo e inicia
   sesión con tu cuenta de GitHub).
2. Arriba: **File → Clone repository →** elige **Reivan-dot/jari-proyectos →
   Clone**. Esto baja una copia del proyecto a tu computadora.
3. Abre esa carpeta en tu explorador de archivos y **copia TODAS tus fotos**
   dentro de ella (todas juntas; sus nombres deben ser como el código: `668.png`,
   `664.png`, etc.).
4. Vuelve a GitHub Desktop: verás todas las fotos listadas como cambios.
   Escribe un resumen (ej. "Fotos de productos") y haz clic en **Commit to main**.
5. Arriba, haz clic en **Push origin**. Eso sube todas las fotos de una vez. ✅

> Si prefieres una carpeta (ej. `fotos/`), ponlas ahí y avísame para ajustar la
> ruta en la tienda (variable `RUTA_IMAGENES`).

### Alternativa: subir por la web en tandas
En https://github.com/Reivan-dot/jari-proyectos → **Add file → Upload files**,
puedes arrastrar **hasta 100 fotos por vez** y dar *Commit*. Repite por tandas.
(Funciona, pero con 1000+ es más cómodo GitHub Desktop.)

---

## ¿Qué pasa si una foto falta?
No hay problema: el producto se muestra igual, solo que su imagen aparece tenue.
En cuanto subas esa foto con el nombre correcto, se verá sola.

---

## Parte C — "Vuelve a pedir" y "Sugeridos para ti"

La tienda ahora muestra dos secciones extra arriba del catálogo:

- **🔁 Vuelve a pedir:** los productos que ese cliente ya pidió antes.
- **✨ Sugeridos para ti:** los productos del **perfil** que tú le asignes al cliente.

Para que funcionen, configura lo siguiente (una sola vez):

### 1) Pestaña `Pedidos` (se crea sola)
No tienes que hacer nada: la primera vez que un cliente envíe un pedido por
WhatsApp, se crea automáticamente una pestaña **`Pedidos`** que va guardando cada
pedido (fecha, N° de cliente, detalle, total y códigos). De ahí salen los productos
de **"Vuelve a pedir"**.

### 2) Pestaña `Perfiles` (la llenas tú)
Crea una pestaña nueva llamada exactamente **`Perfiles`** con estos títulos en la
fila 1:

| A | B |
|---|---|
| perfil | codigos |

Debajo, escribe un perfil por fila y los códigos que quieres sugerir a ese perfil,
**separados por coma**. Ejemplo:

| perfil | codigos |
|--------|---------|
| Taller | 756, 668, 664 |
| Mayoreo | 109469, 109503, 4 |
| Tienda | 109521, 109529 |

### 3) Columna `Perfil` en la hoja de Clientes
En tu hoja de **Clientes**, en la columna **O** (la que sigue después de *Token*),
escribe el nombre del perfil de cada cliente (por ejemplo `Taller`). Debe coincidir
con un nombre de la pestaña `Perfiles`.

> Cuando el cliente inicie sesión, verá en "Sugeridos para ti" justo los productos
> del perfil que le asignaste. Si dejas su perfil en blanco, simplemente no se
> muestra esa sección.

Después de estos cambios, **vuelve a publicar el Apps Script** (Implementar →
Administrar implementaciones → ✏️ Editar → Versión: Nueva versión → Implementar).
