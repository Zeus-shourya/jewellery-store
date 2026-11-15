/*
  Site behaviour: fills in store details from config.js, draws the jewellery
  illustrations, renders the catalogue (home + collection page), runs the
  filters, the product dialog and the WhatsApp enquiry links.
*/
(function () {
  'use strict';

  var S = window.STORE || {};
  var CATALOG = window.CATALOG || [];
  var CATS = window.CATEGORIES || [];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function waLink(msg) {
    return 'https://wa.me/' + String(S.whatsapp || '').replace(/\D/g, '') + '?text=' + encodeURIComponent(msg || S.waGreeting || 'Hello');
  }
  function telLink() { return 'tel:' + String(S.phone || '').replace(/[^+\d]/g, ''); }

  function catLabel(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i].label;
    return id;
  }
  function purityLabel(p) { return p.purity + (p.metal === 'silver' ? ' Silver' : ' Gold'); }
  function priceLabel(p) { return p.price ? '₹ ' + Number(p.price).toLocaleString('en-IN') : 'Price on request'; }
  function artFor(p) {
    if (p.image) return '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">';
    return window.JewelArt ? window.JewelArt.svg(p) : '';
  }

  /* ---------- store details ---------- */

  $$('[data-bind]').forEach(function (el) {
    var v = S[el.getAttribute('data-bind')];
    if (v) el.textContent = v;
  });
  $$('[data-link]').forEach(function (el) {
    var k = el.getAttribute('data-link');
    if (k === 'tel') el.href = telLink();
    else if (k === 'mail') el.href = 'mailto:' + S.email;
    else if (k === 'map') el.href = S.mapUrl || '#';
    else if (k === 'wa') { el.href = waLink(el.getAttribute('data-msg')); el.target = '_blank'; el.rel = 'noopener'; }
    else if (k === 'instagram') { if (S.instagram) el.href = S.instagram; else el.closest('li, span, div').hidden = true; }
  });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- illustrations placed in the page with data-art ---------- */

  $$('[data-art]').forEach(function (el) {
    try {
      var art = JSON.parse(el.getAttribute('data-art'));
      el.innerHTML = window.JewelArt.svg({ name: el.getAttribute('data-name') || '', metal: el.getAttribute('data-metal') || 'gold', art: art });
    } catch (e) { /* leave empty */ }
  });

  /* ---------- mobile menu ---------- */

  var burger = $('#burger'), nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- reveal on scroll ---------- */

  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    : null;
  function watch(root) {
    $$('.reveal:not(.in)', root).forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); });
  }

  /* ---------- product card ---------- */

  function card(p, shown) {
    return '<article class="pc pc--' + p.metal + ' reveal' + (shown ? ' in' : '') + '" data-id="' + esc(p.id) + '" tabindex="0" role="button" aria-label="View details of ' + esc(p.name) + '">' +
      '<div class="pc-art">' + artFor(p) + '<span class="pc-tag">' + esc(purityLabel(p)) + '</span></div>' +
      '<div class="pc-body">' +
        '<p class="pc-cat">' + esc(catLabel(p.cat)) + '</p>' +
        '<h3 class="pc-name">' + esc(p.name) + '</h3>' +
        '<p class="pc-meta"><span>' + esc(p.weight) + ' g approx.</span><span>' + esc(p.id) + '</span></p>' +
        '<div class="pc-foot"><span>' + esc(priceLabel(p)) + '</span><span class="pc-view">View →</span></div>' +
      '</div>' +
    '</article>';
  }

  /* ---------- product dialog ---------- */

  var modal, lastFocus;

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'm-title');
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.modal-x')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  function openModal(id) {
    var p = null;
    for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) p = CATALOG[i];
    if (!p) return;
    if (!modal) buildModal();

    var metalName = p.metal === 'silver' ? 'Silver' : 'Gold';
    var msg = 'Hello ' + (S.name || '') + ', I am interested in this piece:\n' +
      p.name + ' (' + p.id + ')\n' + purityLabel(p) + ', approx. ' + p.weight + ' g\n' +
      'Please share today\'s price and availability.';

    modal.innerHTML =
      '<div class="modal-card' + (p.metal === 'silver' ? ' is-silver' : '') + '">' +
        '<button class="modal-x" aria-label="Close">×</button>' +
        '<div class="modal-art">' + artFor(p) + '</div>' +
        '<div class="modal-info">' +
          '<p class="pc-cat">' + esc(catLabel(p.cat)) + '</p>' +
          '<h2 id="m-title">' + esc(p.name) + '</h2>' +
          '<p class="muted">' + esc(p.desc || '') + '</p>' +
          '<dl class="specs">' +
            '<dt>Metal</dt><dd>' + metalName + '</dd>' +
            '<dt>Purity</dt><dd>' + esc(p.purity) + '</dd>' +
            '<dt>Weight</dt><dd>' + esc(p.weight) + ' g (approx.)</dd>' +
            (p.stones ? '<dt>Stones</dt><dd>' + esc(p.stones) + '</dd>' : '') +
            '<dt>Code</dt><dd>' + esc(p.id) + '</dd>' +
            '<dt>Price</dt><dd>' + esc(priceLabel(p)) + '</dd>' +
          '</dl>' +
          (p.price ? '' : '<p class="note">' + metalName + ' is priced on the day. The final price is the exact weight at today\'s rate, plus making charges and GST. Message us for today\'s figure.</p>') +
          '<div class="modal-btns">' +
            '<a class="btn ' + (p.metal === 'silver' ? 'btn-silver' : 'btn-gold') + '" target="_blank" rel="noopener" href="' + esc(waLink(msg)) + '">Enquire on WhatsApp</a>' +
            '<a class="btn btn-ghost" href="' + esc(telLink()) + '">Call the showroom</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    lastFocus = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('.modal-x', modal).focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var c = e.target.closest('.pc');
    if (c) openModal(c.getAttribute('data-id'));
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('pc')) {
      e.preventDefault();
      openModal(e.target.getAttribute('data-id'));
    }
  });

  /* ---------- home: category tiles + featured pieces ---------- */

  var catsEl = $('#cats');
  if (catsEl) {
    catsEl.innerHTML = CATS.slice(0, 8).map(function (c) {
      var n = CATALOG.filter(function (p) { return p.cat === c.id; }).length;
      return '<a class="cat reveal" href="collection.html?cat=' + c.id + '">' +
        window.JewelArt.svg({ name: c.label, metal: c.metal, art: c.art }) +
        '<b>' + esc(c.label) + '</b><span>' + n + (n === 1 ? ' piece' : ' pieces') + '</span></a>';
    }).join('');
  }

  var featEl = $('#featured');
  if (featEl) {
    featEl.innerHTML = CATALOG.filter(function (p) { return p.featured; }).slice(0, 8).map(function (p) { return card(p); }).join('');
  }

  /* ---------- collection page ---------- */

  var gridEl = $('#grid');
  if (gridEl) {
    var qs = new URLSearchParams(location.search);
    var state = {
      metal: /^(gold|silver)$/.test(qs.get('metal') || '') ? qs.get('metal') : 'all',
      cat: CATS.some(function (c) { return c.id === qs.get('cat'); }) ? qs.get('cat') : 'all',
      q: '',
      sort: 'featured'
    };
    var chipsEl = $('#chips'), countEl = $('#count'), searchEl = $('#search'), sortEl = $('#sort');

    chipsEl.innerHTML = '<button class="chip-btn" data-cat="all">All pieces</button>' +
      CATS.map(function (c) { return '<button class="chip-btn" data-cat="' + c.id + '">' + esc(c.label) + '</button>'; }).join('');

    var render = function (first) {
      var q = state.q.trim().toLowerCase();
      var list = CATALOG.filter(function (p) {
        if (state.metal !== 'all' && p.metal !== state.metal) return false;
        if (state.cat !== 'all' && p.cat !== state.cat) return false;
        if (q) {
          var hay = (p.name + ' ' + p.id + ' ' + catLabel(p.cat) + ' ' + p.metal + ' ' + p.purity + ' ' + (p.stones || '') + ' ' + (p.desc || '')).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });

      if (state.sort === 'wlow') list.sort(function (a, b) { return a.weight - b.weight; });
      else if (state.sort === 'whigh') list.sort(function (a, b) { return b.weight - a.weight; });
      else if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
      else list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });

      gridEl.innerHTML = list.length
        ? list.map(function (p) { return card(p, !first); }).join('')
        : '<div class="empty"><b>Nothing matches that yet</b>Try another category, or message us. Most pieces can be made to order.</div>';

      countEl.textContent = 'Showing ' + list.length + ' of ' + CATALOG.length + ' pieces';

      $$('#metal-seg button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-metal') === state.metal ? 'true' : 'false'); });
      $$('.chip-btn', chipsEl).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === state.cat ? 'true' : 'false'); });

      var u = new URLSearchParams();
      if (state.metal !== 'all') u.set('metal', state.metal);
      if (state.cat !== 'all') u.set('cat', state.cat);
      var s = u.toString();
      history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));

      if (first) watch(gridEl);
    };

    $('#metal-seg').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state.metal = b.getAttribute('data-metal'); render();
    });
    chipsEl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state.cat = b.getAttribute('data-cat'); render();
    });
    searchEl.addEventListener('input', function () { state.q = searchEl.value; render(); });
    sortEl.addEventListener('change', function () { state.sort = sortEl.value; render(); });

    render(true);
  }

  /* ---------- contact form → WhatsApp ---------- */

  var form = $('#enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var msg = 'Hello ' + (S.name || '') + ',\n' +
        'Name: ' + f.name.value.trim() + '\n' +
        (f.phone.value.trim() ? 'Phone: ' + f.phone.value.trim() + '\n' : '') +
        'Looking for: ' + f.interest.value + '\n' +
        (f.message.value.trim() ? '\n' + f.message.value.trim() : '');
      window.open(waLink(msg), '_blank', 'noopener');
    });
  }

  watch(document);
})();
