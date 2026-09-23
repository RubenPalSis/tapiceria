# Tapicerías Deluxe

Web de [tapiceriasdeluxe.com](https://tapiceriasdeluxe.com), generada con [Eleventy](https://www.11ty.dev) y editable desde [Pages CMS](https://app.pagescms.org).

## Dónde está cada cosa

| Ruta | Contenido |
| --- | --- |
| `src/_data/site.json` | Datos globales: teléfono, WhatsApp, email, redes, menú, pie, Google Ads |
| `src/paginas/*.md` | Portada, Servicios, Trabajos, Telas, Nosotros, Contacto, 404 y páginas legales |
| `src/servicios/*.md` | Una ficha por servicio (`/servicios/<slug>/`); también alimenta el pie |
| `src/trabajos/*.md` | Un trabajo realizado por archivo: tarjeta en `/trabajos/` y página propia (`/trabajos/<slug>/`) |
| `src/_data/categorias.json` | Categorías de los trabajos (filtros y etiquetas) |
| `src/img/` | Imágenes (lo que se sube desde Pages CMS acaba aquí) |
| `src/_includes/bloques/` | Plantilla HTML de cada tipo de sección |
| `.pages.yml` | Qué campos muestra Pages CMS |

Cada página está hecha de **secciones** (`secciones:` en el frontmatter) que se pueden añadir, quitar y reordenar desde el CMS.
En los títulos, `*texto*` sale destacado en color, `**texto**` en negrita y un salto de línea se respeta.

## SEO y Google Ads

- Los datos estructurados (negocio local, migas de pan, servicio y preguntas frecuentes) se generan solos en `eleventy.config.js` (filtro `esquema`) a partir de `site.json` y de las secciones de cada página.
- La etiqueta de Google Ads se carga en todas las páginas con el modo de consentimiento v2. Cuentan como conversión («Solicitud de presupuesto») los clics en teléfono, WhatsApp o email y los envíos del formulario (`src/script.js`, `registrarConversion`).

## Desarrollo

```bash
npm install
npm start        # servidor local en http://localhost:8080
npm run build    # genera _site/
```

## Publicación

`.github/workflows/deploy.yml` compila y publica en GitHub Pages cada vez que hay un cambio en `main`, incluidos los que se guardan desde Pages CMS.
