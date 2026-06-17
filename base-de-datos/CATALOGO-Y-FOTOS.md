# Catálogo automático y carga de las fotos (1000+ productos)

## Parte A — El catálogo (precios automáticos desde Google)

Los productos de la tienda se leen de tu hoja de Google. Cuando cambies un precio
ahí, la tienda se actualiza sola (en uno o dos minutos).

### Pasos
1. Abre la **misma hoja de Google** donde se guardan los clientes (Clientes JARI).
2. Abajo, crea una **pestaña nueva** y nómbrala exactamente: **`Productos`**
   (con P mayúscula).
3. En esa pestaña, pon estos títulos en la **fila 1**, una por columna (A a F):

   | A | B | C | D | E | F |
   |---|---|---|---|---|---|
   | codigo | nombre | descripcion | precio | medida | imagen |

4. Pega debajo TODOS tus productos (puedes copiar y pegar directo desde tu Excel
   PRECIOS.xlsx). Ejemplo:

   | codigo | nombre | descripcion | precio | medida | imagen |
   |--------|--------|-------------|--------|--------|--------|
   | 668 | FARO HORIZONTAL | Faro LED rect blanco 6 CREE LED | 45 | PAR | 668.png |
   | 664 | AROMA CORCHO | Aroma corcho cherry en lata | 37 | PZ | 664.png |

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
