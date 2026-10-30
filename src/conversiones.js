(() => {
  'use strict';

  document.addEventListener('click', event => {
    const enlace = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!enlace || typeof window.gtag !== 'function') return;

    const href = enlace.getAttribute('href') || '';
    const sendTo = href.startsWith('tel:')
      ? 'AW-445269684/bhzZCLu23a4dELSNqdQB'
      : href.includes('wa.me') || href.includes('api.whatsapp.com')
        ? 'AW-445269684/ia69CJjh2a4dELSNqdQB'
        : null;

    if (sendTo) window.gtag('event', 'conversion', { send_to: sendTo });
  });
})();