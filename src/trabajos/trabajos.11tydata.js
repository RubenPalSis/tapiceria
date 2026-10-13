// Cada archivo de esta carpeta es un trabajo realizado: tarjeta en /trabajos/ y página propia.
export default {
  layout: 'trabajo.njk',
  tags: 'trabajos',
  permalink: data => `/trabajos/${data.slug || data.page.fileSlug}/`,
  migas_padre: [{ texto: 'Trabajos', url: '/trabajos/' }],
  lightbox: true,
  sitemap: { frecuencia: 'yearly', prioridad: '0.6' },
  eleventyComputed: {
    miga: data => data.titulo,
    // Títulos y descripciones que Google no tenga que cortar (≈60 y ≈160 caracteres).
    titulo_seo: data => {
      if (data.titulo_seo) return data.titulo_seo;
      const largo = `${data.titulo} | ${data.site.nombre} Zaragoza`;
      return largo.length <= 60 ? largo : `${data.titulo} | ${data.site.nombre}`;
    },
    descripcion: data => {
      if (data.descripcion) return data.descripcion;
      const resumen = String(data.resumen ?? '').trim().replace(/[.\s]*$/, '.');
      const largo = `${resumen} Trabajo de nuestro taller de tapicería en Zaragoza. Presupuesto gratis y recogida a domicilio.`;
      return largo.length <= 160 ? largo : `${resumen} Tapicería en Zaragoza.`;
    },
    og: data => ({ titulo: data.titulo, descripcion: data.resumen, imagen: data.portada, tipo: 'article' }),
  },
};
