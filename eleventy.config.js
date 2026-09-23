// Sitio estático generado con Eleventy. El contenido vive en src/paginas, src/servicios
// y src/_data/site.json, y se edita desde Pages CMS (ver .pages.yml).

const escapeHtml = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default function (eleventyConfig) {
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true, trimBlocks: true, lstripBlocks: true });

  for (const p of ['src/img', 'src/styles.css', 'src/script.js', 'src/robots.txt']) {
    eleventyConfig.addPassthroughCopy(p);
  }

  // Texto con formato sencillo: **negrita**, *destacado* y saltos de línea.
  eleventyConfig.addFilter('inline', s => String(s ?? '')
    .trim()
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>'));

  // Una línea del titular de portada: *palabra* en color, _palabra_ en cursiva.
  eleventyConfig.addFilter('palabras', s => {
    const out = [];
    for (const m of String(s ?? '').matchAll(/\*([^*]+)\*|_([^_]+)_|(\S+)/g)) {
      const [cls, text] = m[1] ? [' accent', m[1]] : m[2] ? [' italic', m[2]] : ['', m[3]];
      for (const w of text.split(/\s+/)) out.push(`<span class="word${cls}">${escapeHtml(w)}</span>`);
    }
    return out.join(' ');
  });

  eleventyConfig.addFilter('whatsapp', (mensaje, numero) =>
    `https://wa.me/${numero}` + (mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''));

  eleventyConfig.addFilter('dosCifras', n => String(n).padStart(2, '0'));

  eleventyConfig.addFilter('estiloSeccion', b => {
    let css = '';
    if (b.fondo === 'alterno') css += 'background:var(--bg-2);';
    if (b.fondo === 'superficie') css += 'background:var(--surface);border-top:1px solid var(--line-2);border-bottom:1px solid var(--line-2);';
    if (b.espacio_superior === 'reducido') css += 'padding-top:1.5rem;';
    if (b.espacio_superior === 'minimo') css += 'padding-top:1rem;';
    return (b.ancla ? ` id="${escapeHtml(b.ancla)}"` : '') + (css ? ` style="${css}"` : '');
  });

  eleventyConfig.addFilter('tieneBloque', (secciones, pred) =>
    (secciones || []).some(b => (pred === 'ampliable' ? b.tipo === 'galeria' && b.ampliable : b.tipo === pred || b.ancla === pred)));

  // Primer ancla (#id) de las secciones que siguen a la posición indicada.
  eleventyConfig.addFilter('anclaSiguiente', (secciones, desde) =>
    (secciones || []).slice(desde).find(b => b.ancla)?.ancla || 'main');

  eleventyConfig.addFilter('min', (a, b) => Math.min(a, b));

  eleventyConfig.addCollection('servicios', api =>
    api.getFilteredByTag('servicios').sort((a, b) => (a.data.orden ?? 99) - (b.data.orden ?? 99)));

  // Trabajos realizados: primero los que tienen fecha más reciente, después los destacados.
  eleventyConfig.addCollection('trabajos', api =>
    api.getFilteredByTag('trabajos').sort((a, b) =>
      String(b.data.fecha ?? '').localeCompare(String(a.data.fecha ?? ''))
      || (b.data.destacado ? 1 : 0) - (a.data.destacado ? 1 : 0)));

  eleventyConfig.addFilter('porCategoria', (lista, cat) =>
    (cat ? (lista || []).filter(t => t.data.categoria === cat) : lista || []));

  eleventyConfig.addFilter('primeros', (lista, n) => (n ? (lista || []).slice(0, n) : lista || []));

  // Trabajos de la misma categoría (y si faltan, otros) para "más trabajos".
  eleventyConfig.addFilter('relacionados', (lista, url, categoria, n = 3) => {
    const otros = (lista || []).filter(t => t.url !== url);
    const misma = otros.filter(t => t.data.categoria === categoria);
    return [...misma, ...otros.filter(t => !misma.includes(t))].slice(0, n);
  });

  eleventyConfig.addFilter('nombreCategoria', (slug, categorias) =>
    (categorias || []).find(c => c.slug === slug)?.nombre || slug);

  // Solo las categorías que tienen algún trabajo, para no mostrar filtros vacíos.
  eleventyConfig.addFilter('categoriasUsadas', (categorias, trabajos) =>
    (categorias || []).filter(c => (trabajos || []).some(t => t.data.categoria === c.slug)));

  eleventyConfig.addFilter('fechaLarga', f => (f
    ? new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(f))
    : ''));

  eleventyConfig.addGlobalData('ahora', () => new Date());

  // JSON-LD seguro dentro de <script>: sin "</script>" ni comentarios HTML.
  eleventyConfig.addFilter('jsonld', obj => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c'));

  // Quita el formato del CMS (*destacado*, **negrita**, saltos) para textos planos.
  const textoPlano = s => String(s ?? '').replace(/\*+([^*]+)\*+/g, '$1').replace(/_([^_]+)_/g, '$1').replace(/\s+/g, ' ').trim();
  eleventyConfig.addFilter('textoPlano', textoPlano);

  // Datos estructurados de cada página, generados a partir de site.json y de sus secciones:
  // negocio local, web, página, migas de pan, servicio y preguntas frecuentes.
  eleventyConfig.addFilter('esquema', d => {
    const { site, page, migas_padre = [], servicios = [] } = d;
    const secciones = d.secciones || [];
    const url = site.url + page.url;
    const negocioId = site.url + '/#negocio';
    const webId = site.url + '/#web';
    const imagen = site.url + ((d.og && d.og.imagen) || site.imagen_social);
    const esServicio = (d.tags || []).includes('servicios');
    const cabecera = secciones.find(b => b.tipo === 'cabecera');

    const negocio = {
      '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
      '@id': negocioId,
      name: site.nombre,
      description: site.descripcion_negocio,
      url: site.url + '/',
      logo: site.url + '/img/favicon.png',
      image: site.url + site.imagen_social,
      telephone: site.telefono,
      email: site.email,
      priceRange: site.rango_precios,
      currenciesAccepted: 'EUR',
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.ciudad,
        addressRegion: site.provincia,
        addressCountry: 'ES',
      },
      geo: { '@type': 'GeoCoordinates', latitude: site.latitud, longitude: site.longitud },
      hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.nombre + ' ' + site.ciudad)}`,
      areaServed: [
        ...(site.zonas || []).map(name => ({ '@type': 'City', name })),
        { '@type': 'AdministrativeArea', name: site.region },
      ],
      openingHoursSpecification: (site.horarios || []).map(h => ({
        '@type': 'OpeningHoursSpecification', dayOfWeek: h.dias, opens: h.abre, closes: h.cierra,
      })),
      contactPoint: {
        '@type': 'ContactPoint', telephone: site.telefono, email: site.email,
        contactType: 'customer service', areaServed: 'ES', availableLanguage: 'Spanish',
      },
      sameAs: [site.facebook_url, site.instagram_url].filter(Boolean),
      makesOffer: servicios.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.data.nombre, url: site.url + s.url },
      })),
    };

    const web = {
      '@type': 'WebSite', '@id': webId, url: site.url + '/', name: site.nombre,
      inLanguage: 'es-ES', publisher: { '@id': negocioId },
    };

    const pagina = {
      '@type': page.url === '/contacto/' ? 'ContactPage' : page.url === '/trabajos/' ? 'CollectionPage' : 'WebPage',
      '@id': url + '#pagina',
      url,
      name: d.titulo_seo,
      description: d.descripcion,
      inLanguage: 'es-ES',
      isPartOf: { '@id': webId },
      about: { '@id': negocioId },
      primaryImageOfPage: { '@type': 'ImageObject', url: imagen },
    };

    const grafo = [negocio, web, pagina];

    const miga = d.miga || (cabecera && cabecera.miga);
    if (page.url !== '/' && miga) {
      const migas = [{ texto: 'Inicio', url: '/' }, ...migas_padre, { texto: textoPlano(miga), url: page.url }];
      pagina.breadcrumb = { '@id': url + '#migas' };
      grafo.push({
        '@type': 'BreadcrumbList', '@id': url + '#migas',
        itemListElement: migas.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.texto, item: site.url + m.url })),
      });
    }

    if (esServicio) {
      pagina.mainEntity = { '@id': url + '#servicio' };
      grafo.push({
        '@type': 'Service', '@id': url + '#servicio',
        name: `${d.nombre} en ${site.ciudad}`,
        serviceType: d.nombre,
        description: d.descripcion,
        url,
        image: imagen,
        provider: { '@id': negocioId },
        areaServed: [{ '@type': 'City', name: site.ciudad }, { '@type': 'AdministrativeArea', name: site.region }],
      });
    }

    if ((d.tags || []).includes('trabajos')) {
      pagina.mainEntity = { '@id': url + '#trabajo' };
      grafo.push({
        '@type': 'CreativeWork', '@id': url + '#trabajo',
        name: d.titulo,
        description: d.resumen,
        url,
        image: [d.portada, ...(d.fotos || []).map(f => f.imagen)].filter(Boolean).map(i => site.url + i),
        creator: { '@id': negocioId },
        ...(d.fecha ? { dateCreated: new Date(d.fecha).toISOString().slice(0, 10) } : {}),
        inLanguage: 'es-ES',
      });
    }

    const preguntas = secciones.filter(b => b.tipo === 'preguntas').flatMap(b => b.preguntas || []);
    if (preguntas.length) {
      grafo.push({
        '@type': 'FAQPage', '@id': url + '#preguntas', url, inLanguage: 'es-ES',
        mainEntity: preguntas.map(p => ({
          '@type': 'Question', name: textoPlano(p.pregunta),
          acceptedAnswer: { '@type': 'Answer', text: textoPlano(p.respuesta) },
        })),
      });
    }

    return { '@context': 'https://schema.org', '@graph': grafo };
  });

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', layouts: '_includes/layouts', data: '_data' },
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk',
  };
}
