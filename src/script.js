/* ==========================================================================
   Tapicerías Deluxe — interacciones
   Vanilla JS, sin dependencias.
   ========================================================================== */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const leer = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* ---------------------------------------------------------------- Tema */
  // El tema inicial ya lo pone un script en <head> para evitar el parpadeo.
  function pintarTema() {
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = document.documentElement.dataset.theme === 'dark' ? '#14100c' : '#f6f1ea';
  }
  pintarTema();
  $('#themeToggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const cambiar = () => { document.documentElement.dataset.theme = next; pintarTema(); };
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(cambiar); else cambiar();
    guardar('td-theme', next);
  });

  /* ------------------------------------------- Cookies (Consent Mode v2) */
  const cookies = $('#cookies');

  function guardarConsentimiento(aceptadas) {
    guardar('td-cookies', aceptadas ? 'aceptadas' : 'rechazadas');
    const estado = aceptadas ? 'granted' : 'denied';
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: estado, ad_user_data: estado, ad_personalization: estado, analytics_storage: estado
      });
    }
    if (cookies) cookies.hidden = true;
  }

  if (cookies && !leer('td-cookies')) cookies.hidden = false;
  $('#cookiesSi')?.addEventListener('click', () => guardarConsentimiento(true));
  $('#cookiesNo')?.addEventListener('click', () => guardarConsentimiento(false));
  $('#cookiesConfig')?.addEventListener('click', () => { if (cookies) cookies.hidden = false; });

  /* ------------------------------------------ Conversiones de Google Ads */
  // Acción «Solicitud de presupuesto»: cualquier contacto directo cuenta como conversión.
  function registrarConversion(canal) {
    const sendTo = document.body.dataset.conversion;
    if (typeof window.gtag !== 'function' || !sendTo) return;
    window.gtag('event', 'conversion', { send_to: sendTo, canal: canal, transport_type: 'beacon' });
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const canal = href.startsWith('tel:') ? 'telefono'
      : href.startsWith('mailto:') ? 'email'
      : /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href) ? 'whatsapp'
      : null;
    if (canal) registrarConversion(canal);
  });

  /* ------------------------------------------------------------ Cabecera */
  const header = $('#header');
  const burger = $('#burger');
  const nav    = $('#nav');
  const progressBar = $('#progressBar');
  const toTop  = $('#toTop');
  const waFab  = $('.fab--wa');
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-stuck', y > 20);
    // Se esconde al bajar y vuelve al subir.
    header.classList.toggle('is-hidden', y > 480 && y > lastY + 2 && !nav.classList.contains('is-open'));
    if (Math.abs(y - lastY) > 2) lastY = y;
    if (progressBar) progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    toTop?.classList.toggle('is-on', y > 900);
    waFab?.classList.toggle('is-wide', y > window.innerHeight * 0.7);
    ticking = false;
  }
  onScroll();
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------------------------------------------------------- Menú móvil */
  function setNav(abierto) {
    nav.classList.toggle('is-open', abierto);
    burger.classList.toggle('is-open', abierto);
    header.classList.toggle('menu-open', abierto);
    burger.setAttribute('aria-expanded', String(abierto));
    burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('no-scroll', abierto);
  }
  burger?.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  $$('.nav a').forEach(a => a.addEventListener('click', () => setNav(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 980 && nav.classList.contains('is-open')) setNav(false); });

  /* --------------------------------------------- Entrada al hacer scroll */
  const revealables = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('is-in'));
  }

  /* ---------------------------------------------------------- Contadores */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / 1700, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('es-ES') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------ Parallax */
  const parallaxEls = $$('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    let pTicking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const speed = parseFloat(el.dataset.parallax) || 0;
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
      pTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!pTicking) { pTicking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------ Antes y después */
  // Cada comparador lleva su propio tirador; el recorte es puro CSS (--v).
  $$('.ba').forEach(ba => {
    const handle = $('.ba__handle', ba);
    if (!handle) return;

    const setSplit = pct => {
      const v = Math.max(0, Math.min(100, pct));
      ba.style.setProperty('--v', v + '%');
      handle.setAttribute('aria-valuenow', Math.round(v));
    };
    const fromPointer = clientX => {
      const rect = ba.getBoundingClientRect();
      setSplit(((clientX - rect.left) / rect.width) * 100);
    };

    let dragging = false;
    ba.addEventListener('pointerdown', e => {
      // En táctil solo arrastra el tirador: el resto se reserva para deslizar el carrusel.
      if (e.pointerType === 'touch' && !e.target.closest('.ba__handle')) return;
      dragging = true;
      fromPointer(e.clientX);
      e.preventDefault();
    });
    window.addEventListener('pointermove', e => { if (dragging) fromPointer(e.clientX); }, { passive: true });
    const stopDrag = () => { dragging = false; };
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);

    handle.addEventListener('keydown', e => {
      const step = e.shiftKey ? 10 : 4;
      const v = parseFloat(ba.style.getPropertyValue('--v')) || 50;
      const keys = { ArrowLeft: v - step, ArrowRight: v + step, Home: 0, End: 100 };
      if (e.key in keys) { setSplit(keys[e.key]); e.preventDefault(); }
    });
  });

  const rail = $('#baRail');
  if (rail) {
    const cards   = $$('.ba-card', rail);
    const dotsBox = $('#baDots');
    const baPrev  = $('#baPrev');
    const baNext  = $('#baNext');
    const behavior = reduceMotion ? 'auto' : 'smooth';
    const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : rail.clientWidth);

    cards.forEach((card, i) => {
      if (!dotsBox) return;
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ver transformación ' + (i + 1));
      dot.addEventListener('click', () => rail.scrollTo({ left: card.offsetLeft - cards[0].offsetLeft, behavior }));
      dotsBox.appendChild(dot);
    });
    const dots = dotsBox ? $$('button', dotsBox) : [];
    let raf = 0;

    function syncRail() {
      const i = Math.max(0, Math.min(cards.length - 1, Math.round(rail.scrollLeft / (step() || 1))));
      dots.forEach((d, n) => {
        d.classList.toggle('is-active', n === i);
        d.setAttribute('aria-current', n === i ? 'true' : 'false');
      });
      const max = rail.scrollWidth - rail.clientWidth - 1;
      if (baPrev) baPrev.disabled = rail.scrollLeft <= 1;
      if (baNext) baNext.disabled = rail.scrollLeft >= max;
    }

    rail.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; syncRail(); });
    }, { passive: true });
    window.addEventListener('resize', syncRail);
    baPrev?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior }));
    baNext?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior }));
    syncRail();
  }

  /* ----------------------------------------- Logos: rueda que no se acaba */
  const logosTrack = $('#logosTrack');
  if (logosTrack) {
    const group = $('.logos__group', logosTrack);
    const SPEED = 40; // px por segundo

    function buildLogos() {
      $$('.logos__group', logosTrack).slice(1).forEach(n => n.remove());
      const w = group.getBoundingClientRect().width;
      const viewport = logosTrack.parentElement.clientWidth;
      if (!w || !viewport) return;
      // Copias suficientes para cubrir la pantalla más un grupo: la costura cae fuera de la vista.
      const copies = Math.ceil(viewport / w) + 1;
      for (let i = 1; i < copies; i++) {
        const clone = group.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        logosTrack.appendChild(clone);
      }
      logosTrack.style.setProperty('--shift', w + 'px');
      logosTrack.style.setProperty('--dur', (w / SPEED).toFixed(2) + 's');
    }

    let logosTimer;
    buildLogos();
    window.addEventListener('load', buildLogos);
    window.addEventListener('resize', () => {
      clearTimeout(logosTimer);
      logosTimer = setTimeout(buildLogos, 200);
    });
  }

  /* ------------------------------------------------ Trabajos: filtros */
  $$('[data-filtros]').forEach(box => {
    const grid = document.getElementById(box.dataset.filtros);
    if (!grid) return;
    const chips = $$('[data-filter]', box);
    chips.forEach(chip => chip.addEventListener('click', () => {
      const filtro = chip.dataset.filter;
      chips.forEach(c => {
        c.classList.toggle('is-active', c === chip);
        c.setAttribute('aria-pressed', String(c === chip));
      });
      $$('[data-cat]', grid).forEach((card, i) => {
        const show = filtro === 'all' || card.dataset.cat === filtro;
        card.classList.toggle('is-hidden', !show);
        card.classList.add('is-in');
        if (show && !reduceMotion) {
          card.classList.remove('is-pop');
          void card.offsetWidth;
          card.style.animationDelay = Math.min(i, 8) * 40 + 'ms';
          card.classList.add('is-pop');
        }
      });
    }));
  });

  /* ------------------------------------------------------ Visor de fotos */
  const lightbox = $('#lightbox');
  if (lightbox) {
    const lbImg = $('#lbImg');
    const lbCap = $('#lbCaption');
    const lbPrev = $('#lbPrev');
    const lbNext = $('#lbNext');
    let items = [];
    let index = 0;
    let origen = null;

    const render = () => {
      index = (index + items.length) % items.length;
      const btn = items[index];
      const img = $('img', btn);
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = btn.dataset.caption || img.alt;
      lbPrev.hidden = lbNext.hidden = items.length < 2;
    };
    const abrir = btn => {
      const grupo = btn.closest('[data-zoom-group]') || document;
      items = $$('[data-zoom]', grupo).filter(b => b.offsetParent !== null);
      index = Math.max(0, items.indexOf(btn));
      origen = btn;
      render();
      lightbox.hidden = false;
      document.body.classList.add('no-scroll');
      requestAnimationFrame(() => lightbox.classList.add('is-open'));
      $('#lbClose').focus();
    };
    const cerrar = () => {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(() => { lightbox.hidden = true; }, 320);
      origen?.focus();
    };

    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-zoom]');
      if (btn) abrir(btn);
    });
    $('#lbClose').addEventListener('click', cerrar);
    lbPrev.addEventListener('click', () => { index--; render(); });
    lbNext.addEventListener('click', () => { index++; render(); });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) cerrar(); });
    document.addEventListener('keydown', e => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowLeft') { index--; render(); }
      if (e.key === 'ArrowRight') { index++; render(); }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setNav(false);
  });

  /* ------------------------------------------------- Formulario de contacto */
  const form = $('#contactForm');
  const formError = $('#formError');
  let method = 'whatsapp';

  const mostrarError = texto => {
    formError.hidden = !texto;
    formError.textContent = texto || '';
  };

  $$('#contactForm [type="submit"]').forEach(btn => {
    btn.addEventListener('click', () => { method = btn.dataset.method; });
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      nombre:   $('#nombre').value.trim(),
      telefono: $('#telefono').value.trim(),
      email:    $('#email').value.trim(),
      servicio: $('#servicio').value,
      mensaje:  $('#mensaje').value.trim()
    };

    const missing = [];
    [['nombre', 'su nombre'], ['telefono', 'su teléfono'], ['mensaje', 'un mensaje']].forEach(([id, label]) => {
      const empty = !data[id];
      $('#' + id).closest('.c-field')?.classList.toggle('has-error', empty);
      if (empty) missing.push(label);
    });

    if (missing.length) {
      mostrarError('Por favor, indique ' + missing.join(', ') + '.');
      $('.has-error input, .has-error textarea')?.focus();
      return;
    }
    mostrarError('');

    const cuerpo =
      `Hola, soy ${data.nombre}.\n` +
      `Servicio: ${data.servicio}\n` +
      `Teléfono: ${data.telefono}\n` +
      (data.email ? `Email: ${data.email}\n` : '') +
      `\n${data.mensaje}`;

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', { event_category: 'Contacto', event_label: data.servicio, method });
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: 'lead_presupuesto', servicio: data.servicio, metodo_contacto: method });
    }

    if (method === 'email') {
      const btns = $$('#contactForm [type="submit"]');
      btns.forEach(b => { b.disabled = true; });

      fetch(document.body.dataset.formspree || 'https://formspree.io/f/xaenqpvl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...data, _subject: 'Nuevo presupuesto: ' + data.servicio })
      })
      .then(res => {
        if (res.ok) {
          form.reset();
          form.hidden = true;
          const ok = $('#formSuccess');
          if (ok) {
            ok.hidden = false;
            ok.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
          }
          registrarConversion('formulario_email');
        } else {
          return res.json().then(d => mostrarError(d.errors
            ? d.errors.map(x => x.message).join(', ')
            : 'Error al enviar. Inténtelo de nuevo.'));
        }
      })
      .catch(() => mostrarError('Error de conexión. Inténtelo de nuevo.'))
      .finally(() => btns.forEach(b => { b.disabled = false; }));
    } else {
      registrarConversion('formulario_whatsapp');
      window.open(`https://wa.me/${document.body.dataset.whatsapp || '34654680667'}?text=${encodeURIComponent(cuerpo)}`, '_blank', 'noopener');
    }
  });

  $$('#contactForm input, #contactForm textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.c-field')?.classList.remove('has-error');
      if (formError) mostrarError('');
    });
  });
})();
