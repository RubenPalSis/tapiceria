# Tapicerías Deluxe

Web de [tapiceriasdeluxe.com](https://tapiceriasdeluxe.com). Está hecha con [Eleventy](https://www.11ty.dev) (genera páginas HTML estáticas) y se edita desde [Pages CMS](https://app.pagescms.org). Cada cambio que se guarda se publica solo en GitHub Pages en uno o dos minutos.

- **Editar contenido:** [app.pagescms.org](https://app.pagescms.org) → repositorio `RubenPalSis/tapiceria`
- **Ver si se ha publicado:** [pestaña Actions del repositorio](https://github.com/RubenPalSis/tapiceria/actions)

## Índice

1. [Editar desde Pages CMS](#1-editar-desde-pages-cms)
2. [Tareas habituales, paso a paso](#2-tareas-habituales-paso-a-paso)
3. [Cambios que se hacen en los archivos](#3-cambios-que-se-hacen-en-los-archivos)
4. [Trabajar en tu ordenador](#4-trabajar-en-tu-ordenador)
5. [Publicación y problemas típicos](#5-publicación-y-problemas-típicos)
6. [SEO y Google Ads: cómo funciona](#6-seo-y-google-ads-cómo-funciona)
7. [Mapa del proyecto](#7-mapa-del-proyecto)

---

## 1. Editar desde Pages CMS

Entra en [app.pagescms.org](https://app.pagescms.org) con la cuenta de GitHub y abre el repositorio. En el menú de la izquierda hay cuatro apartados:

| Apartado | Qué contiene |
| --- | --- |
| **Ajustes del sitio** | Teléfono, WhatsApp, email, redes, horario, menú, textos del pie, zonas de trabajo, datos para Google y Google Ads. Lo que cambies aquí se aplica a toda la web. |
| **Trabajos realizados** | Un elemento por trabajo. Cada uno sale como tarjeta de noticia y tiene su propia página en `/trabajos/<url>/`. |
| **Páginas** | Inicio, Servicios, Trabajos, Telas, Nosotros, Contacto, 404 y páginas legales. |
| **Servicios** | Una ficha por servicio en `/servicios/<url>/`. También forman la lista de servicios del pie. |

Al pulsar **Guardar**, Pages CMS sube el cambio a GitHub y la web se vuelve a publicar sola. Tarda uno o dos minutos. Si no ves el cambio, recarga la web con `Ctrl + F5`.

### Formato de los textos

En casi todos los títulos y textos cortos:

| Escribes | Se ve |
| --- | --- |
| `*palabra*` | En color cobre y cursiva (el estilo de los títulos) |
| `**palabra**` | En negrita |
| Un salto de línea | Un salto de línea |

En el titular grande de la portada (una línea por entrada), `*palabra*` sale en color y `_palabra_` en cursiva.

### Las páginas están hechas de secciones

Cada página es una lista de **secciones**. Desde el CMS puedes añadirlas, quitarlas, cambiar su orden (arrastrándolas) y editar sus textos y fotos. Estos son los tipos disponibles:

| Sección | Para qué sirve |
| --- | --- |
| Portada (hero) | La cabecera grande de la página de inicio: foto a todo el ancho con el titular, el texto y los botones encima, y las cifras debajo. Solo en Inicio y siempre como primera sección. Usa una foto horizontal de al menos 1600 px de ancho; el texto va a la izquierda, así que lo importante de la foto conviene que quede a la derecha. |
| Cabecera de página | Título de las páginas interiores, con migas de pan, botones opcionales y una **imagen opcional** a la derecha. Debe ser la primera sección. |
| Cinta de palabras en movimiento | Franja oscura con palabras que se desplazan. |
| Imagen + texto | Foto grande (y otra pequeña flotante opcional), sello redondo, título, párrafos, lista con ticks y un enlace o botón. Con **«Imagen a la derecha»** se invierte el orden. |
| Tarjetas de servicios | Rejilla de tarjetas con foto. **«Tarjeta ancha»** ocupa dos huecos. |
| Características con iconos | Tarjetas pequeñas con icono, título y texto. Quedan mejor con 3, 4 o 6 elementos. |
| Antes y después | Carrusel de fotos con comparador deslizante. Solo uno por página. |
| Galería de fotos | Rejilla de fotos. Con **«Ampliar fotos al hacer clic»** se abren en grande. |
| Trabajos realizados (tarjetas) | Muestra **automáticamente** los trabajos del apartado *Trabajos realizados*. Puedes limitar cuántos, filtrar por categoría, mostrar botones de filtro y poner el primero en grande. |
| Cifras destacadas | Banda con números que se animan (años, muebles…). |
| Logos de clientes | Carrusel infinito de logos. |
| Llamada a la acción con pasos | Bloque oscuro con título, botones y pasos numerados. |
| Preguntas frecuentes | Preguntas desplegables. Google las recibe también como datos estructurados. |
| Formulario de contacto (portada / página de contacto) | Formulario que envía por WhatsApp o por email, junto a los botones de contacto. Solo uno por página. |
| Texto largo | Texto con formato (páginas legales). |

Casi todas las secciones tienen además:

- **Fondo:** normal, alterno (tono crema) o superficie.
- **Espacio superior:** para juntarla más a la sección anterior.
- **Ancla:** un nombre (sin espacios) para enlazar directamente a esa sección con `#nombre`. Por ejemplo, en Inicio el formulario tiene el ancla `contacto`, y un botón con enlace `#contacto` baja hasta él.

### Imágenes

- Se suben desde cualquier campo de imagen y se guardan en `src/img/`.
- **Se optimizan solas al publicar**: cada foto se convierte a WebP en tres tamaños (480, 900 y 1400 px) y cada visitante descarga el que necesita (el móvil, el pequeño). También se añade su ancho y alto para que la página no dé saltos al cargar. Puedes subir la foto tal cual sale del móvil.
- Aun así, mejor que no pase de **5 MB** por foto: cuanto más grande, más tarda la publicación.
- Nombres en minúsculas, sin espacios ni tildes: `sofa-chester-salon.jpg`.
- Rellena siempre el **texto alternativo** (qué se ve en la foto). Lo leen Google y los lectores de pantalla.

---

## 2. Tareas habituales, paso a paso

### Añadir un trabajo realizado

1. **Trabajos realizados → Añadir**.
2. Rellena:
   - **Título:** corto y descriptivo («Sofá chéster en terciopelo verde»).
   - **URL:** en minúsculas y con guiones (`sofa-chester-terciopelo-verde`). Es la dirección de la página, así que no la cambies después de publicarla.
   - **Categoría.**
   - **Fecha:** ponla siempre. Los trabajos se ordenan del más reciente al más antiguo.
   - **Resumen:** una o dos frases. Sale en la tarjeta y es la descripción para Google.
   - **Foto de portada** y su descripción.
   - **Más fotos** (opcional).
   - **Antes y después** (opcional): si pones las dos fotos, la página del trabajo muestra el comparador deslizante y la tarjeta lleva la etiqueta «Antes y después».
   - **Texto del trabajo:** qué se hizo, qué tela, cuánto tardó… Cuanto más concreto, mejor para Google.
3. Guarda.

Aparecerá sola en tres sitios: en la portada (los 3 más recientes), en `/trabajos/` y en la ficha del servicio de su categoría.

**Destacado** solo sirve para trabajos sin fecha: los sube por delante del resto.

### Cambiar teléfono, WhatsApp, email, horario o redes

**Ajustes del sitio.** Se actualiza en toda la web: cabecera, pie, botones, botón flotante y datos para Google.

- **Teléfono (formato internacional):** `+34654680667`, sin espacios. Es el que usan los enlaces de llamada.
- **Teléfono tal como se muestra / corto:** solo es el texto visible.
- **Número de WhatsApp:** solo cifras con prefijo, `34654680667`.
- Si cambias el horario, cambia también **Horario para Google**: días en inglés (`Monday`, `Tuesday`…) y horas en formato `08:00`.

### Cambiar textos o fotos de una página

**Páginas → la página → Secciones →** abre la sección y edita. Las fichas de servicio están en **Servicios**.

### Añadir, quitar o reordenar secciones

En la lista **Secciones** de la página: *Añadir* (eliges el tipo), la papelera para quitar y arrastrar para cambiar el orden.

### Añadir o cambiar preguntas frecuentes

Dentro de la sección **Preguntas frecuentes** de la página. La primera pregunta sale abierta. No hace falta tocar nada para Google: los datos estructurados se generan solos.

### Crear una página nueva

1. **Páginas → Añadir**.
2. **Título (SEO)**, **Meta descripción** y **URL** con barras al principio y al final (`/tapizado-caravanas/`).
3. Añade secciones. Empieza siempre por una **Cabecera de página**: pon en *Nombre en las migas de pan* el nombre corto de la página.
4. Para que salga en el menú: **Ajustes del sitio → Menú principal → Añadir** (texto y la misma URL).

La página entra sola en el `sitemap.xml`. Si no quieres que la encuentre Google, marca **Ocultar a buscadores**.

### Añadir un servicio nuevo

1. **Servicios → Añadir**. Rellena nombre, URL, orden en el pie, SEO y secciones (copiar la estructura de otro servicio es lo más rápido).
2. El servicio sale solo en el **pie** y en el `sitemap.xml`.
3. Hay tres sitios que **no se actualizan solos**, añádelo a mano si quieres que aparezca:
   - La tarjeta en **Páginas → Inicio → Tarjetas de servicios**.
   - La tarjeta en **Páginas → Servicios → Tarjetas de servicios**.
   - La opción del desplegable en los formularios: **Inicio → Formulario de contacto (portada)** y **Contacto → Formulario de contacto**.

### Cambiar el menú

**Ajustes del sitio → Menú principal.** El orden de la lista es el orden del menú. Se recomienda no pasar de 6 elementos.

### SEO de una página o servicio

En cada página o servicio:

- **Título (SEO):** menos de 60 caracteres, con la palabra clave al principio: «Tapizado de Sofás en Zaragoza | Tapicerías Deluxe».
- **Meta descripción:** 120–155 caracteres, con una llamada a la acción («Presupuesto gratis…»).
- **Redes sociales (Open Graph):** título, texto e imagen que salen al compartir el enlace por WhatsApp o Facebook. Si lo dejas vacío, se usan el título SEO, la descripción y la imagen por defecto de Ajustes.
- **Sitemap:** frecuencia y prioridad (solo orientativo para Google).

Los trabajos no tienen estos campos: usan el título y el resumen.

### Cambiar las zonas donde trabajáis

**Ajustes del sitio**, en dos campos:

- **Pie – zonas de cobertura:** el texto que se ve en el pie.
- **SEO – localidades donde se trabaja:** la lista que recibe Google.

### Google Ads

En **Ajustes del sitio**:

- **Google Ads – ID:** `AW-445269684`.
- **Google Ads – conversión:** `AW-445269684/6ggFCO_Myf0cELSNqdQB` (la acción «Solicitud de presupuesto»).

Si Google te da una etiqueta de conversión nueva, cambia solo el segundo campo. Si vacías el ID, desaparecen la etiqueta de Google, el aviso de cookies y el enlace «Configurar cookies».

### Cambiar el formulario de email

Los envíos por email llegan a través de [Formspree](https://formspree.io). La dirección del formulario está en **Ajustes del sitio → Formspree – URL del formulario**. El email de destino se cambia en la cuenta de Formspree, no en la web.

---

## 3. Cambios que se hacen en los archivos

Estas cosas no están en el CMS. Se editan en GitHub (abre el archivo y pulsa el lápiz) o en tu ordenador (ver [apartado 4](#4-trabajar-en-tu-ordenador)).

### Textos fijos del diseño

| Texto | Archivo |
| --- | --- |
| «¿Le damos una nueva vida a su mueble?» y el resto del pie | `src/_includes/partials/footer.njk` |
| Texto del aviso de cookies | `src/_includes/partials/footer.njk` |
| Diseño de la portada (degradado, botones) | `src/_includes/bloques/hero_inicio.njk` |
| Título «Pida su presupuesto» del formulario de la portada | `src/_includes/bloques/contacto_breve.njk` |
| Etiquetas y botones del formulario | `src/_includes/partials/formulario.njk` |
| Botones WhatsApp / Teléfono / Email junto al formulario | `src/_includes/partials/canales.njk` |
| Textos de la página de cada trabajo («¿Tiene un mueble parecido?», «Más fotos del trabajo», «Más trabajos») | `src/_includes/layouts/trabajo.njk` |
| Etiquetas «Antes y después» / «N fotos» y «Ver trabajo» de las tarjetas | `src/_includes/partials/tarjeta_trabajo.njk` |

Lo que va entre `{{ }}` o `{% %}` es código de plantilla: cambia solo el texto de alrededor.

### Añadir o renombrar una categoría de trabajos

Hay que tocarla en **tres** sitios con el mismo identificador (en minúsculas y sin espacios, por ejemplo `cabeceros`):

1. `src/_data/categorias.json`: añade `{ "slug": "cabeceros", "nombre": "Cabeceros" }`. El nombre es el texto que se ve en filtros y tarjetas.
2. `.pages.yml`, colección `trabajos`, campo `categoria`: añade `- { name: cabeceros, label: Cabeceros }`.
3. `.pages.yml`, bloque `lista_trabajos`, campo `categoria`: la misma línea.

Los botones de filtro de `/trabajos/` solo muestran categorías que tengan algún trabajo.

### Añadir un icono para «Características con iconos»

1. `src/_data/iconos.json`: añade `"nombre-del-icono": "<svg ...>...</svg>"`. Iconos gratuitos de 24×24 con trazo: [lucide.dev](https://lucide.dev) (copia el SVG y cambia las comillas dobles por `\"`).
2. `.pages.yml`, bloque `caracteristicas`, campo `icono`: añade `- nombre-del-icono` a la lista.

### Colores y tipografías

Todo el diseño está en `src/styles.css`. Los colores están al principio, en `:root` (modo claro) y `[data-theme="dark"]` (modo oscuro):

| Variable | Uso |
| --- | --- |
| `--bg`, `--bg-2`, `--surface` | Fondo general, fondo alterno y tarjetas |
| `--ink`, `--ink-2`, `--ink-3` | Texto principal, secundario y apagado |
| `--brand`, `--brand-2` | Color de marca (cobre): palabras destacadas, iconos, detalles |
| `--dark`, `--on-dark` | Bloques oscuros (cinta, llamada a la acción, pie) y su texto |
| `--wa` | Verde de los botones de WhatsApp |

Tipografías: se cargan desde Google Fonts en `src/_includes/layouts/base.njk` (línea `fonts.googleapis.com`) y se asignan en `--ff-display` (títulos: Fraunces) y `--ff-text` (texto: Manrope). Si cambias una, cambia las dos cosas.

### Cambiar el diseño de una sección

Cada tipo de sección tiene su plantilla en `src/_includes/bloques/<tipo>.njk`, y sus estilos en `src/styles.css`, cada bloque bajo un comentario con su nombre (`/* ---------- Cinta ---------- */`, `/* ---------- Preguntas frecuentes ---------- */`…).

### Crear un tipo de sección nuevo

1. Plantilla `src/_includes/bloques/mi_bloque.njk`. Los campos se leen como `b.campo`. Copia una existente como punto de partida.
2. En `.pages.yml`, dentro de `secciones → blocks`, añade `- name: mi_bloque` con su `label` y sus `fields`. El `name` debe coincidir con el nombre del archivo.
3. Estilos en `src/styles.css`.

Para que algo entre con animación al hacer scroll, ponle la clase `reveal` (y opcionalmente `data-delay="1"` a `"5"` para escalonar).

### Cabecera, pie y estructura general

- `src/_includes/layouts/base.njk`: `<head>` (SEO, Google Ads, fuentes), cabecera, secciones y pie. Es la base de todas las páginas.
- `src/_includes/layouts/trabajo.njk`: la página de cada trabajo.
- `src/_includes/partials/header.njk` y `footer.njk`: cabecera y pie.

### Rendimiento y transiciones

- **Imágenes:** la optimización está en `eleventy.config.js` (`eleventyImageTransformPlugin`): formatos, tamaños y calidad. Cada `<img>` de las plantillas lleva un atributo `sizes` que indica al navegador cuánto ocupa la foto en pantalla; si creas una plantilla nueva con fotos, añádeselo (copia el de una parecida).
- **Transiciones entre páginas** (Chrome y Edge): fundido corto, y al pulsar una tarjeta de trabajo su foto viaja hasta la portada del trabajo. El CSS está en `src/styles.css` (bloque «Transiciones entre páginas»); la lógica, en `src/script.js` («Transición a un trabajo») y en el script del `<head>` de `base.njk`.
- **Precarga:** al pasar el ratón por un enlace interno, Chrome y Edge preparan la página de destino y el cambio es casi instantáneo (bloque `speculationrules` en `base.njk`).
- **Animaciones al hacer scroll:** solo se animan los bloques que están más abajo de la pantalla al cargar; lo que se ve nada más entrar aparece directamente. La animación grande de la portada solo se ve la primera vez en cada visita.
- **Google Ads** se descarga cuando la página ya ha cargado, para no retrasar fotos y textos. Las visitas y clics anteriores quedan en cola y se envían igual.

### Interacciones (JavaScript)

Todo en `src/script.js`, sin librerías: tema claro/oscuro, aviso de cookies, conversiones de Google Ads, menú móvil, animaciones al hacer scroll, contadores, comparador antes/después, carrusel de logos, filtros de trabajos, visor de fotos y formulario.

---

## 4. Trabajar en tu ordenador

Necesitas [Node.js 22](https://nodejs.org) y [Git](https://git-scm.com).

```bash
git clone https://github.com/RubenPalSis/tapiceria.git
cd tapiceria
npm install
npm start          # abre http://localhost:8080 y se recarga al guardar
```

- `npm run build` genera la web final en `_site/` (es lo mismo que hace GitHub al publicar). Si da error aquí, también fallaría al publicar.
- Para publicar: `git add -A`, `git commit -m "descripción"` y `git push`.
- Si alguien ha guardado cambios desde el CMS mientras tanto, haz antes `git pull`.

---

## 5. Publicación y problemas típicos

Cada cambio en la rama `main` (desde el CMS o con `git push`) lanza `.github/workflows/deploy.yml`, que compila la web y la publica en GitHub Pages.

En **GitHub → Settings → Pages**, la opción *Source* debe estar en **GitHub Actions**. Con *Deploy from a branch*, GitHub publica el repositorio sin compilar y se ve una página en blanco con el título «tapiceria».

### Dirección de la web y dominio propio

- **Sin dominio propio**, la web está en **https://rubenpalsis.github.io/tapiceria/**. La compilación detecta sola la subcarpeta `/tapiceria/` y la añade a todos los enlaces e imágenes (`HtmlBasePlugin` en `eleventy.config.js`, variable `PATH_PREFIX` en el workflow).
- **Para usar `tapiceriasdeluxe.com`:**
  1. En **Settings → Pages → Custom domain**, escribe `tapiceriasdeluxe.com` y guarda.
  2. En el panel DNS del dominio (Hostinger), apunta el dominio a GitHub Pages siguiendo [la guía de GitHub](https://docs.github.com/es/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site): registros `A` a `185.199.108.153`, `185.199.109.153`, `185.199.110.153` y `185.199.111.153`, y `CNAME` de `www` a `rubenpalsis.github.io`.
  3. Cuando GitHub lo verifique, marca **Enforce HTTPS** y vuelve a ejecutar el workflow (Actions → *Publicar sitio* → *Run workflow*). A partir de ahí la web se publica en la raíz del dominio, sin subcarpeta, sin tocar nada más.

  Al cambiar el DNS deja de verse la web anterior alojada en Hostinger, así que haz antes una copia si la necesitas.

### «He guardado y no cambia nada»

1. Abre [Actions](https://github.com/RubenPalSis/tapiceria/actions). La última ejecución debe estar en verde.
2. Si está en amarillo, aún se está publicando: espera un minuto.
3. Si está en verde, recarga con `Ctrl + F5` (el navegador guarda copias).

### La publicación sale en rojo

Abre la ejecución y el paso **npm run build**. El error casi siempre indica el archivo y la línea. Las causas más habituales:

- **Dos puntos seguidos de espacio en un texto** editado a mano en un `.md`: `descripcion: Telas para sofás: antimanchas…` rompe el archivo. Pon el texto entre comillas simples: `descripcion: 'Telas para sofás: antimanchas…'`. Desde el CMS no pasa, porque pone las comillas solo.
- **Un texto que empieza por `*`** (por ejemplo un título `*Nuevo* servicio`): también necesita comillas.
- **Sangría incorrecta** (espacios al principio de la línea) en un archivo editado a mano.
- **Una sección con un tipo que no existe** (el `tipo:` debe coincidir con un archivo de `src/_includes/bloques/`).

Mientras la publicación falla, la web sigue mostrando la última versión buena: nada se rompe para los visitantes.

### Deshacer un cambio

En GitHub, abre el archivo → **History** → elige la versión buena → copia su contenido y guárdalo. O en local: `git revert <commit>` y `git push`.

---

## 6. SEO y Google Ads: cómo funciona

### SEO automático

- **Datos estructurados (JSON-LD):** se generan solos en cada página a partir de *Ajustes del sitio* (nombre, teléfono, horario, zonas, coordenadas, redes) y de las secciones: negocio local, migas de pan, ficha de servicio, trabajo realizado y preguntas frecuentes. El código está en `eleventy.config.js` (filtro `esquema`). El campo **Datos estructurados extra** de cada página solo hace falta para algo especial.
- **Sitemap:** `/sitemap.xml` se genera con todas las páginas salvo las marcadas *Ocultar a buscadores*. Está declarado en `src/robots.txt`.
- **Etiquetas en el `<head>`:** canonical, Open Graph, Twitter y geolocalización, en `src/_includes/layouts/base.njk`.
- Las páginas legales y la 404 no se indexan.

Para comprobarlo: [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results) con cualquier URL de la web, y envía el sitemap en [Google Search Console](https://search.google.com/search-console).

### Google Ads y cookies

- La etiqueta de Google (`gtag.js`) se carga en **todas las páginas** con el **modo de consentimiento v2**. Por defecto las cookies publicitarias están denegadas, y solo se activan si el visitante pulsa **Aceptar** en el aviso. Si rechaza, Google recibe señales sin cookies y estima las conversiones.
- La elección se guarda en el navegador (`td-cookies`). Para volver a ver el aviso: enlace **Configurar cookies** del pie, o borrar los datos del sitio en el navegador.
- **Cuentan como conversión** («Solicitud de presupuesto»):
  - clic en cualquier enlace de teléfono (`tel:`);
  - clic en cualquier enlace de WhatsApp (`wa.me`);
  - clic en cualquier enlace de email (`mailto:`);
  - envío del formulario por WhatsApp;
  - envío correcto del formulario por email.

  Funciona con cualquier enlace nuevo de ese tipo que añadas, sin tocar código. El código está en `src/script.js` (función `registrarConversion`).
- **Comprobarlo:** abre la web con [Tag Assistant](https://tagassistant.google.com), pulsa el teléfono o WhatsApp y verás el evento `conversion`. En Google Ads, *Objetivos → Conversiones*, la acción debe aparecer como **Activa** (tarda hasta 24–48 h en actualizarse).
- Si cambias las cookies que se usan, actualiza **Páginas → Política de cookies**.

---

## 7. Mapa del proyecto

| Ruta | Contenido |
| --- | --- |
| `src/_data/site.json` | *Ajustes del sitio*: datos del negocio, menú, pie, SEO, Google Ads, Formspree |
| `src/_data/categorias.json` | Categorías de los trabajos |
| `src/_data/iconos.json` | Iconos de «Características con iconos» |
| `src/paginas/*.md` | *Páginas* (una por archivo; la URL la marca el campo `permalink`) |
| `src/servicios/*.md` | *Servicios* (`/servicios/<slug>/`) |
| `src/trabajos/*.md` | *Trabajos realizados* (`/trabajos/<slug>/`) |
| `src/img/` | Imágenes |
| `src/_includes/layouts/` | Estructura general (`base.njk`) y página de trabajo (`trabajo.njk`) |
| `src/_includes/bloques/` | Una plantilla por tipo de sección |
| `src/_includes/partials/` | Piezas comunes: cabecera, pie, formulario, tarjeta de trabajo, logo |
| `src/styles.css` | Todo el diseño |
| `src/script.js` | Todas las interacciones |
| `src/sitemap.njk`, `src/robots.txt` | Sitemap y robots |
| `eleventy.config.js` | Configuración de Eleventy, filtros, colecciones y datos estructurados |
| `.pages.yml` | Qué apartados y campos muestra Pages CMS |
| `.github/workflows/deploy.yml` | Publicación automática en GitHub Pages |
| `_site/` | Web generada, con las imágenes optimizadas en `_site/img/opt/` (no se sube a GitHub, no la edites) |
