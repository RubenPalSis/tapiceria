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
    .map(link => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
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

  /* --------------------------------------------------- Antes y después */
  const TRANSFORMS = [
    { before: 'img/ba1-antes.jpg', after: 'img/ba1-despues.jpg', title: 'Sillas de comedor · Restauración completa' },
    { before: 'img/ba2-antes.jpg', after: 'img/ba2-despues.jpg', title: 'Sofá chaise longue · Tapizado integral' },
    { before: 'img/ba3-antes.jpg', after: 'img/ba3-despues.jpg', title: 'Sillón orejero · Cambio de tela y relleno' },
    { before: 'img/ba4-antes.jpg', after: 'img/ba4-despues.jpg', title: 'Sofá de piel · Renovación completa' },
    { before: 'img/ba5-antes.jpg', after: 'img/ba5-despues.jpg', title: 'Sofá de salón · Cojines nuevos a medida' },
    { before: 'img/ba6-antes.jpg', after: 'img/ba6-despues.jpg', title: 'Sillón relax · Reconstrucción y tapizado' }
  ];

  const ba       = $('#ba');
  const baClip   = $('#baClip');
  const baHandle = $('#baHandle');
  const baBefore = $('#baBefore');
  const baAfter  = $('#baAfter');
  const baTitle  = $('#baTitle');
  const baIndex  = $('#baIndex');
  const baDots   = $('#baDots');
  let current = 0;

  if (ba) {
    // Puntos de navegación
    TRANSFORMS.forEach((t, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', t.title);
      dot.addEventListener('click', () => showTransform(i));
      baDots.appendChild(dot);
    });

    const sizeBefore = () => { baBefore.style.width = ba.clientWidth + 'px'; };
    window.addEventListener('resize', sizeBefore);

    function showTransform(i) {
      current = (i + TRANSFORMS.length) % TRANSFORMS.length;
      const t = TRANSFORMS[current];
      baBefore.src = t.before;
      baAfter.src  = t.after;
      baBefore.alt = t.title + ' (antes)';
      baAfter.alt  = t.title + ' (después)';
      baTitle.textContent = t.title;
      baIndex.textContent = current + 1;
      $$('button', baDots).forEach((d, n) => {
        d.classList.toggle('is-active', n === current);
        d.setAttribute('aria-selected', n === current ? 'true' : 'false');
      });
      setSplit(50);
    }

    function setSplit(pct) {
      const v = Math.max(0, Math.min(100, pct));
      baClip.style.width = v + '%';
      baHandle.style.left = v + '%';
      baHandle.setAttribute('aria-valuenow', Math.round(v));
      ba.dataset.value = v;
    }

    const pointerSplit = clientX => {
      const rect = ba.getBoundingClientRect();
      setSplit(((clientX - rect.left) / rect.width) * 100);
    };

    // El arrastre se escucha en la ventana: así no se corta al salir de la imagen.
    let dragging = false;
    ba.addEventListener('pointerdown', e => {
      dragging = true;
      pointerSplit(e.clientX);
      e.preventDefault();
    });
    window.addEventListener('pointermove', e => { if (dragging) pointerSplit(e.clientX); });
    window.addEventListener('pointerup', () => { dragging = false; });
    window.addEventListener('pointercancel', () => { dragging = false; });

    baHandle.addEventListener('keydown', e => {
      const step = e.shiftKey ? 10 : 4;
      const v = parseFloat(ba.dataset.value) || 50;
      if (e.key === 'ArrowLeft')  { setSplit(v - step); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setSplit(v + step); e.preventDefault(); }
      if (e.key === 'Home')       { setSplit(0);  e.preventDefault(); }
      if (e.key === 'End')        { setSplit(100); e.preventDefault(); }
    });

    $('#baPrev')?.addEventListener('click', () => showTransform(current - 1));
    $('#baNext')?.addEventListener('click', () => showTransform(current + 1));

    sizeBefore();
    showTransform(0);
    window.addEventListener('load', sizeBefore);
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
      const field = $('#' + id).closest('.field');
      const empty = !data[id];
      field.classList.toggle('has-error', empty);
      if (empty) missing.push(label);
    });

    if (missing.length) {
      formError.hidden = false;
      formError.textContent = 'Por favor, indique ' + missing.join(', ') + '.';
      $('.has-error input, .has-error textarea')?.focus();
      return;
    }
    formError.hidden = true;

    const cuerpo =
      `Hola, soy ${data.nombre}.\n` +
      `Servicio: ${data.servicio}\n` +
      `Teléfono: ${data.telefono}\n` +
      (data.email ? `Email: ${data.email}\n` : '') +
      `\n${data.mensaje}`;

    if (method === 'email') {
      window.location.href =
        `mailto:tapiceriasdeluxe@gmail.com?subject=${encodeURIComponent('Presupuesto: ' + data.servicio)}` +
        `&body=${encodeURIComponent(cuerpo)}`;
    } else {
      window.open(`https://wa.me/34654680667?text=${encodeURIComponent(cuerpo)}`, '_blank', 'noopener');
    }
  });

  $$('#contactForm input, #contactForm textarea').forEach(input => {
    input.addEventListener('input', () => input.closest('.field').classList.remove('has-error'));
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
