export default {
  layout: 'base.njk',
  tags: 'servicios',
  permalink: data => `/servicios/${data.slug || data.page.fileSlug}/`,
  migas_padre: [{ texto: 'Servicios', url: '/servicios/' }],
};
