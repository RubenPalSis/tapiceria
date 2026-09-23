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
    titulo_seo: data => data.titulo_seo || `${data.titulo} | ${data.site.nombre} Zaragoza`,
    descripcion: data => data.descripcion || data.resumen,
    og: data => ({ titulo: data.titulo, descripcion: data.resumen, imagen: data.portada, tipo: 'article' }),
  },
};
