/* ==========================================================================
   Tapicerías Deluxe — interacciones
   Vanilla JS, sin dependencias.
   ========================================================================== */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- Tema */
  const themeToggle = $('#themeToggle');
  const storedTheme = localStorage.getItem('td-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

  function setTheme(mode) {
    document.documentElement.dataset.theme = mode;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = mode === 'dark' ? '#14100c' : '#faf7f2';
  }

  themeToggle?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('td-theme', next);
  });

  /* -------------------------------------------------------------- Header */
  const header = $('#header');
  const burger = $('#burger');
  const nav    = $('#nav');
  const scrim  = $('#navScrim');
  const progressBar = $('#progressBar');
  const toTop  = $('#toTop');
  const waFab  = $('.fab--wa');
  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('is-stuck', y > 24);
    // Oculta la cabecera al bajar, la devuelve al subir.
    header.classList.toggle('is-hidden', y > 420 && y > lastY && !nav.classList.contains('is-open'));
    lastY = y;

    if (progressBar) progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    toTop?.classList.toggle('is-on', y > 700);
    // La píldora de WhatsApp se despliega al dejar atrás el hero.
    waFab?.classList.toggle('is-wide', y > window.innerHeight * 0.75);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ------------------------------------------------------- Menú móvil */
  function closeNav() {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    scrim.classList.remove('is-on');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!nav.classList.contains('is-open')) scrim.hidden = true; }, 400);
  }

  function openNav() {
    scrim.hidden = false;
    requestAnimationFrame(() => scrim.classList.add('is-on'));
    nav.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('no-scroll');
  }

  burger?.addEventListener('click', () => {
    nav.classList.contains('is-open') ? closeNav() : openNav();
  });
  scrim?.addEventListener('click', closeNav);
  $$('.nav__link, .nav__phone').forEach(a => a.addEventListener('click', closeNav));

  /* --------------------------------------------- Reveal al hacer scroll */
  const revealables = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('is-in'));
  }

  /* ------------------------------------------------ Sección activa en nav */
  const navLinks = $$('.nav__link');
  const sections = navLinks
    .filter(link => link.getAttribute('href')?.startsWith('#'))
    .map(link => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(l => {
          if (l.getAttribute('href')?.startsWith('#')) {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------------------------------------------------------- Contadores */
  const counters = $$('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const duration = 1600;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('es-ES') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------ Parallax */
  const parallaxEls = $$('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const speed = parseFloat(el.dataset.parallax) || 0;
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------------------------------- Antes y después (carrusel) */
  // Cada tarjeta lleva su propio tirador; el recorte es puro CSS (--v).
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
      // En táctil sólo arrastra el tirador: el resto de la tarjeta se reserva
      // para deslizar el carrusel con el dedo.
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
      if (e.key === 'ArrowLeft')  { setSplit(v - step); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setSplit(v + step); e.preventDefault(); }
      if (e.key === 'Home')       { setSplit(0);   e.preventDefault(); }
      if (e.key === 'End')        { setSplit(100); e.preventDefault(); }
    });
  });

  const rail = $('#baRail');
  if (rail) {
    const cards   = $$('.ba-card', rail);
    const dotsBox = $('#baDots');
    const baPrev  = $('#baPrev');
    const baNext  = $('#baNext');

    // Ancho de una tarjeta + hueco: lo que avanza cada clic.
    const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : rail.clientWidth);
    const scrollTo = left => rail.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });

    cards.forEach((card, i) => {
      if (!dotsBox) return;
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Transformación ' + (i + 1));
      dot.addEventListener('click', () => scrollTo(card.offsetLeft));
      dotsBox.appendChild(dot);
    });

    const dots = dotsBox ? $$('button', dotsBox) : [];
    let raf = 0;

    function syncRail() {
      const st = step() || 1;
      const i  = Math.max(0, Math.min(cards.length - 1, Math.round(rail.scrollLeft / st)));
      dots.forEach((d, n) => {
        const on = n === i;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-selected', on ? 'true' : 'false');
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

    baPrev?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    baNext?.addEventListener('click', () => rail.scrollBy({ left:  step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    syncRail();
  }

  /* ------------------------------------- Logos: rueda que no se acaba */
  const logosTrack = $('#logosTrack');
  if (logosTrack) {
    const group = $('.logos__group', logosTrack);
    const SPEED = 46; // px por segundo

    function buildLogos() {
      $$('.logos__group', logosTrack).slice(1).forEach(n => n.remove());
      const w = group.getBoundingClientRect().width;
      const viewport = logosTrack.parentElement.clientWidth;
      if (!w || !viewport) return;
      // Copias suficientes para cubrir la pantalla más un grupo: al saltar de
      // vuelta la costura cae fuera de la vista y el giro parece continuo.
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

  /* ----------------------------------------------- Galería: filtros */
  const tiles = $$('#gallery .tile');
  $$('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      $$('.chip').forEach(c => {
        const on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      tiles.forEach(tile => {
        const show = filter === 'all' || tile.dataset.cat === filter;
        tile.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* --------------------------------------------------- Galería: lightbox */
  const lightbox = $('#lightbox');
  const lbImg    = $('#lbImg');
  const lbCap    = $('#lbCaption');
  let lbIndex = 0;

  const visibleTiles = () => tiles.filter(t => !t.classList.contains('is-hidden'));

  function openLightbox(tile) {
    const list = visibleTiles();
    lbIndex = list.indexOf(tile);
    renderLightbox();
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    $('#lbClose').focus();
  }

  function renderLightbox() {
    const list = visibleTiles();
    if (!list.length) return;
    lbIndex = (lbIndex + list.length) % list.length;
    const tile = list[lbIndex];
    const img = $('img', tile);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = tile.dataset.caption || img.alt;
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { lightbox.hidden = true; lbImg.src = ''; }, 320);
  }

  tiles.forEach(tile => tile.addEventListener('click', () => openLightbox(tile)));
  $('#lbClose')?.addEventListener('click', closeLightbox);
  $('#lbPrev')?.addEventListener('click', () => { lbIndex--; renderLightbox(); });
  $('#lbNext')?.addEventListener('click', () => { lbIndex++; renderLightbox(); });
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  { lbIndex--; renderLightbox(); }
      if (e.key === 'ArrowRight') { lbIndex++; renderLightbox(); }
      return;
    }
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
  });

  /* ------------------------------------------------ Formulario → WhatsApp */
  const form = $('#contactForm');
  const formError = $('#formError');
  let method = 'whatsapp';

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
      const field = $('#' + id).closest('.c-field') || $('#' + id).closest('.field');
      const empty = !data[id];
      field?.classList.toggle('has-error', empty);
      if (empty) missing.push(label);
    });

    if (missing.length) {
      formError.style.display = 'block';
      formError.hidden = false;
      formError.textContent = 'Por favor, indique ' + missing.join(', ') + '.';
      $('.has-error input, .has-error textarea')?.focus();
      return;
    }
    formError.style.display = 'none';
    formError.hidden = true;

    const cuerpo =
      `Hola, soy ${data.nombre}.\n` +
      `Servicio: ${data.servicio}\n` +
      `Teléfono: ${data.telefono}\n` +
      (data.email ? `Email: ${data.email}\n` : '') +
      `\n${data.mensaje}`;

    // Hook de conversión preparado para Google Ads / Google Analytics 4 / GTM
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'Contacto',
        event_label: data.servicio,
        method: method
      });
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'lead_presupuesto',
        servicio: data.servicio,
        metodo_contacto: method
      });
    }

    if (method === 'email') {
      const btns = $$('#contactForm [type="submit"]');
      btns.forEach(b => b.disabled = true);

      fetch('https://formspree.io/f/xaenqpvl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          nombre:   data.nombre,
          telefono: data.telefono,
          email:    data.email,
          servicio: data.servicio,
          mensaje:  data.mensaje,
          _subject: 'Nuevo presupuesto: ' + data.servicio
        })
      })
      .then(res => {
        if (res.ok) {
          form.reset();
          formError.style.display = 'none';
          formError.hidden = true;
          form.style.display = 'none';
          const successEl = $('#formSuccess');
          if (successEl) {
            successEl.style.display = 'flex';
            successEl.hidden = false;
            successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          // Google Ads conversion
          if (typeof gtag_report_conversion === 'function') {
            gtag_report_conversion();
          }
        } else {
          return res.json().then(d => {
            formError.style.display = 'block';
            formError.hidden = false;
            formError.textContent = d.errors
              ? d.errors.map(e => e.message).join(', ')
              : 'Error al enviar. Inténtelo de nuevo.';
          });
        }
      })
      .catch(() => {
        formError.style.display = 'block';
        formError.hidden = false;
        formError.textContent = 'Error de conexión. Inténtelo de nuevo.';
      })
      .finally(() => btns.forEach(b => b.disabled = false));
    } else {
      window.open(`https://wa.me/34654680667?text=${encodeURIComponent(cuerpo)}`, '_blank', 'noopener');
    }
  });

  $$('#contactForm input, #contactForm textarea').forEach(input => {
    input.addEventListener('input', () => {
      (input.closest('.c-field') || input.closest('.field'))?.classList.remove('has-error');
      if (formError) {
        formError.style.display = 'none';
        formError.hidden = true;
      }
    });
  });

  /* ------------------------------------------------------------- Varios */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll suave con compensación de la cabecera fija.
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (header.offsetHeight - 2);
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });
})();
