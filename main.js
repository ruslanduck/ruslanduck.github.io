/* ═══════════════════════════════════════════
   DUCK AGENCY — Global JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll observer for animations ──
  const observerOpts = { threshold: 0.05, rootMargin: '0px 0px -40px 0px' };
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in, .text-reveal').forEach(el => {
    animObserver.observe(el);
  });

  // ── Reveal hero logo strip only after the user actually starts scrolling ──
  // (mobile browsers can fire a "scroll" event on their own — e.g. when the
  // address bar collapses on load — so we also require a real user gesture
  // before we trust a scroll event, and use a higher threshold as a second guard)
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  if (revealEls.length) {
    let userInteracted = false;
    const markInteracted = () => { userInteracted = true; };
    ['touchstart', 'wheel', 'pointerdown', 'keydown'].forEach(evt => {
      window.addEventListener(evt, markInteracted, { passive: true, once: true });
    });

    const revealOnScroll = () => {
      if (userInteracted && window.scrollY > 80) {
        revealEls.forEach(el => el.classList.add('visible'));
        window.removeEventListener('scroll', revealOnScroll);
      }
    };
    window.addEventListener('scroll', revealOnScroll, { passive: true });
  }

  // ── Nav scroll effect ──
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
      lastScroll = y;
    }, { passive: true });
  }

  // ── Mobile menu ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Hero entrance ──
  const heroEls = document.querySelectorAll('.hero-enter');
  if (heroEls.length) {
    setTimeout(() => {
      heroEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('animate'), i * 150);
      });
    }, 200);
  }

  // ── Particle system (JS-driven RAF for cross-browser compatibility) ──
  const particleContainer = document.querySelector('.particles');
  if (particleContainer) {
    const colors = ['#FFDC00', '#FF00F5', '#FFDC00', '#FFDC00', '#FF00F5'];
    const glyphs = ['→', '◆', '+', '//', '{ }', '▸', '–', '×'];
    const pData = [];

    for (let i = 0; i < 45; i++) {
      const p = document.createElement('div');
      const w = (1.5 + Math.random() * 3.5).toFixed(1);
      p.style.cssText = 'position:absolute;border-radius:50%;width:' + w + 'px;height:' + w + 'px;' +
        'left:' + (Math.random() * 100).toFixed(1) + '%;' +
        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
        'will-change:transform,opacity;opacity:0;';
      particleContainer.appendChild(p);
      pData.push({ el: p, dur: 7000 + Math.random() * 16000, phase: Math.random() });
    }

    for (let i = 0; i < 20; i++) {
      const g = document.createElement('div');
      const gc = Math.random() > 0.55
        ? 'rgba(255,220,0,' + (0.25 + Math.random() * 0.35).toFixed(2) + ')'
        : 'rgba(255,0,245,' + (0.2 + Math.random() * 0.3).toFixed(2) + ')';
      g.style.cssText = 'position:absolute;font-family:"Bebas Neue",monospace;font-size:0.65rem;' +
        'letter-spacing:0.08em;pointer-events:none;user-select:none;' +
        'left:' + (Math.random() * 100).toFixed(1) + '%;color:' + gc + ';' +
        'will-change:transform,opacity;opacity:0;';
      g.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      particleContainer.appendChild(g);
      pData.push({ el: g, dur: 11000 + Math.random() * 18000, phase: Math.random(), glyph: true });
    }

    function animateParticles(ts) {
      for (let j = 0; j < pData.length; j++) {
        const d = pData[j];
        const t = ((ts / d.dur) + d.phase) % 1;
        let op, ty, sc;
        if (!d.glyph) {
          ty = 800 - 880 * t;
          sc = t;
          op = t < 0.1 ? t / 0.1 * 0.8 : t < 0.9 ? 0.8 - (t - 0.1) / 0.8 * 0.5 : (1 - t) / 0.1 * 0.3;
          d.el.style.transform = 'translateY(' + ty.toFixed(0) + 'px) scale(' + sc.toFixed(2) + ')';
        } else {
          ty = 80 - 180 * t;
          op = t < 0.12 ? t / 0.12 : t < 0.85 ? 1 - (t - 0.12) / 0.73 * 0.8 : (1 - t) / 0.15 * 0.2;
          d.el.style.transform = 'translateY(' + ty.toFixed(0) + 'px)';
        }
        d.el.style.opacity = (op < 0 ? 0 : op > 1 ? 1 : op).toFixed(3);
      }
      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

  // ── Counter animation ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 1500;
          const step = target / (duration / 30);
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
          }, 30);

          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => countObserver.observe(c));
  }

  // ── FAQ accordion ──
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Case filter ──
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('[data-category]').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s, transform 0.4s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });

      // Hide "More Projects" section if no mini-cases match the filter
      setTimeout(() => {
        const moreSection = document.getElementById('more-projects-section');
        if (moreSection) {
          const anyVisible = [...moreSection.querySelectorAll('.mini-case')].some(c => c.style.display !== 'none');
          moreSection.style.display = anyVisible ? '' : 'none';
        }
      }, 350);
    });
  });

  // ── Email copy ──
  window.copyEmail = function() {
    const email = 'ruslan@duck-agency.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => showToast('Email copied!')).catch(() => fallbackCopy(email));
    } else {
      fallbackCopy(email);
    }
  };

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('Email copied!'); }
    catch { showToast('ruslan@duck-agency.com'); }
    document.body.removeChild(ta);
  }

  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ── Magnetic buttons (desktop only) ──
  if (window.innerWidth > 768) {
    document.querySelectorAll('.btn-primary, .btn-pink').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translateY(-3px) translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Tilt effect on cards (desktop) ──
  if (window.innerWidth > 1024) {
    document.querySelectorAll('.case-card, .service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      });
    });
  }

  // ── Parallax on hero blobs ──
  const blobs = document.querySelectorAll('.hero-blob');
  if (blobs.length && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      blobs.forEach((blob, i) => {
        const speed = (i + 1) * 15;
        blob.style.transform = `translate(${mx * speed}px, ${my * speed}px)`;
      });
    }, { passive: true });
  }

});

/* ── Contact form handler ── */
(function () {
  var f = document.getElementById('contactForm');
  if (!f) return;
  var status = document.getElementById('cfStatus');
  // Submissions are emailed via FormSubmit (no backend needed).
  // First real submission triggers a one-time confirmation email to this address — click it once to activate.
  var ENDPOINT = 'https://formsubmit.co/ajax/ruslan@duck-agency.com';
  var emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var els = f.elements;
    var name = els.name.value.trim();
    var email = els.email.value.trim();
    var note = els.note.value.trim();

    [els.name, els.email, els.note].forEach(function (el) { el.classList.remove('invalid'); });
    status.className = 'form-status';

    var bad = false;
    if (!name) { els.name.classList.add('invalid'); bad = true; }
    if (!email || !emailRe.test(email)) { els.email.classList.add('invalid'); bad = true; }
    if (!note) { els.note.classList.add('invalid'); bad = true; }
    if (bad) { status.textContent = 'Please fill in all fields with a valid email.'; status.classList.add('err'); return; }

    var btn = f.querySelector('button[type=submit]');
    var orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…';

    function done(ok) {
      btn.disabled = false; btn.textContent = orig;
      status.className = 'form-status ' + (ok ? 'ok' : 'err');
      if (ok) { f.reset(); status.textContent = "Thanks – your message is on its way. We'll reply within one business day."; }
      else { status.textContent = 'Something went wrong. Email us at ruslan@duck-agency.com.'; }
    }

    if (!ENDPOINT) { setTimeout(function () { done(true); }, 500); return; }
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        note: note,
        _subject: 'New Duck Agency website lead: ' + name,
        _template: 'table',
        page: location.pathname
      })
    }).then(function (r) { done(r.ok); }).catch(function () { done(false); });
  });
})();

/* ── Welding-style spark spray on the flywheel "Scale" block ── */
(function () {
  var block = document.querySelector('.fw-result');
  if (!block) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var timer = null;

  function spawn(side) {
    var s = document.createElement('span');
    s.className = 'weld-spark';
    var size = 2 + Math.random() * 3;
    s.style.width = s.style.height = size + 'px';
    s.style.top = (15 + Math.random() * 70) + '%';
    s.style[side] = '0px';
    var dist = 60 + Math.random() * 200;            // how far it flies
    var dx = (side === 'left' ? -1 : 1) * dist;
    var dy = (Math.random() - 0.5) * 220;           // vertical spread
    var dur = 0.30 + Math.random() * 0.5;
    s.style.setProperty('--dx', dx + 'px');
    s.style.setProperty('--dy', dy + 'px');
    s.style.animationDuration = dur + 's';
    block.appendChild(s);
    setTimeout(function () { s.remove(); }, dur * 1000 + 60);
  }

  function burst() {
    var n = 5 + Math.floor(Math.random() * 5);      // per side, per tick
    for (var i = 0; i < n; i++) { spawn('left'); spawn('right'); }
  }

  block.addEventListener('mouseenter', function () {
    if (timer) return;
    burst();
    timer = setInterval(burst, 35);                 // ~very dense, welding-like
  });
  function stop() { clearInterval(timer); timer = null; }
  block.addEventListener('mouseleave', stop);
})();

/* ── Flywheel intro sequence: pop each stage, then weld the Scale block ── */
(function () {
  var fw = document.getElementById('flywheel');
  if (!fw) return;
  var stages = [].slice.call(fw.querySelectorAll('.fw-stage'));
  var result = fw.querySelector('.fw-result');
  if (!result || stages.length < 3) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var played = false;

  function pop(el) { if (!el) return; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }

  function spawnSpark(side) {
    var s = document.createElement('span');
    s.className = 'weld-spark';
    var size = 2 + Math.random() * 3;
    s.style.width = s.style.height = size + 'px';
    s.style.top = (15 + Math.random() * 70) + '%';
    s.style[side] = '0px';
    var dist = 60 + Math.random() * 200;
    var dx = (side === 'left' ? -1 : 1) * dist;
    var dy = (Math.random() - 0.5) * 220;
    var dur = 0.3 + Math.random() * 0.5;
    s.style.setProperty('--dx', dx + 'px');
    s.style.setProperty('--dy', dy + 'px');
    s.style.animationDuration = dur + 's';
    result.appendChild(s);
    setTimeout(function () { s.remove(); }, dur * 1000 + 60);
  }
  function burst() { var n = 5 + Math.floor(Math.random() * 5); for (var i = 0; i < n; i++) { spawnSpark('left'); spawnSpark('right'); } }

  var inView = false, looping = false, timers = [], weldIv = null;
  var STEP = 1000, WELD = 2600, GAP = 700; // delay between stages, weld duration, pause before repeat

  function clearAll() {
    timers.forEach(clearTimeout); timers = [];
    if (weldIv) { clearInterval(weldIv); weldIv = null; }
    result.classList.remove('lit');
  }

  function cycle() {
    if (!inView) { looping = false; return; }
    looping = true;
    pop(stages[0]);
    timers.push(setTimeout(function () { pop(stages[1]); }, STEP));
    timers.push(setTimeout(function () { pop(stages[2]); }, STEP * 2));
    timers.push(setTimeout(function () {
      pop(result);
      result.classList.add('lit');
      weldIv = setInterval(burst, 35);
      timers.push(setTimeout(function () {
        clearInterval(weldIv); weldIv = null;
        result.classList.remove('lit');
      }, WELD));
    }, STEP * 3));
    // repeat while still in view
    timers.push(setTimeout(cycle, STEP * 3 + WELD + GAP));
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        inView = true;
        if (!reduce && !looping) cycle();
      } else {
        inView = false;
        clearAll();
        looping = false;
      }
    });
  }, { threshold: 0.4 });
  io.observe(fw);
})();

/* ── ROI calculator (Operations / Revenue pages) ── */
(function () {
  var wrap = document.querySelector('.calc-wrapper');
  if (!wrap) return;
  var salary = document.getElementById('calc-salary');
  var salaryR = document.getElementById('calc-salary-r');
  var team = document.getElementById('calc-team');
  var teamR = document.getElementById('calc-team-r');
  if (!salary || !team) return; // not the ops/savings calculator
  var saveEl = document.getElementById('calc-save');
  var curBtns = wrap.querySelectorAll('.cur-btn');
  var curSpan = salary ? salary.parentElement.querySelector('.calc-currency') : null;
  var cur = '$';

  function fmt(n) {
    n = Math.max(0, Math.round(n));
    if (n >= 1000000) return cur + (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return cur + Math.round(n / 1000) + 'K';
    return cur + n;
  }
  curBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      curBtns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      cur = b.getAttribute('data-cur');
      if (curSpan) curSpan.textContent = cur;
      calc();
    });
  });
  function calc() {
    var s = Math.max(0, parseFloat(salary.value) || 0);
    var t = Math.max(0, parseFloat(team.value) || 0);
    var annual = s * 12 * t;
    wrap.querySelectorAll('.calc-row').forEach(function (row) {
      var pct = parseFloat(row.getAttribute('data-pct')) / 100;
      row.querySelectorAll('.calc-val').forEach(function (c) {
        var y = parseFloat(c.getAttribute('data-y'));
        c.textContent = fmt(annual * pct * y);
      });
    });
    if (saveEl) saveEl.textContent = fmt(annual * 0.40 * 3); // 40% over 3 years
  }
  function link(a, b) { if (a && b) a.addEventListener('input', function () { b.value = a.value; calc(); }); }
  link(salary, salaryR); link(salaryR, salary);
  link(team, teamR); link(teamR, team);
  calc();
})();

/* ── Revenue growth calculator (Revenue page) ── */
(function () {
  var wrap = document.getElementById('revcalc');
  if (!wrap) return;
  var leads = document.getElementById('rev-leads'), leadsR = document.getElementById('rev-leads-r');
  var conv = document.getElementById('rev-conv'), convR = document.getElementById('rev-conv-r');
  var deal = document.getElementById('rev-deal'), dealR = document.getElementById('rev-deal-r');
  var saveEl = document.getElementById('rev-save');
  var nowEl = document.getElementById('rev-now');
  var curBtns = wrap.querySelectorAll('.cur-btn');
  var moneySpans = wrap.querySelectorAll('.calc-currency[data-money]');
  var cur = '$';

  function fmt(n) {
    n = Math.max(0, Math.round(n));
    if (n >= 1000000) return cur + (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return cur + Math.round(n / 1000) + 'K';
    return cur + n;
  }
  function pct(v) { return (v).toFixed(1).replace(/\.0$/, '') + '%'; }
  var tgt = document.getElementById('rev-target');
  var rows = [].slice.call(wrap.querySelectorAll('.calc-row'));
  function calc() {
    var L = Math.max(0, parseFloat(leads.value) || 0);
    var C = Math.max(0, parseFloat(conv.value) || 0);   // current rate, %
    var D = Math.max(0, parseFloat(deal.value) || 0);
    var nowYr = L * (C / 100) * D * 12;                 // current revenue / year
    // which row to recommend, based on the entered rate
    var pick = C <= 2 ? 0 : C < 7 ? 1 : C < 15 ? 2 : 3;
    rows.forEach(function (row, i) {
      var add = parseFloat(row.getAttribute('data-add')) || 0;
      var ex = L * (add / 100) * D * 12;                // extra / year from added points
      var rate = row.querySelector('.cr-rate');
      if (rate) rate.textContent = pct(C + add);
      row.querySelector('[data-col="cur"]').textContent = fmt(nowYr);
      row.querySelector('[data-col="ex"]').textContent = '+' + fmt(ex);
      row.classList.toggle('highlight', i === pick);
    });
    // bottom section mirrors the recommended row
    var pickAdd = parseFloat(rows[pick].getAttribute('data-add')) || 0;
    if (tgt) tgt.textContent = pct(C + pickAdd);
    if (saveEl) saveEl.textContent = '+' + fmt(L * (pickAdd / 100) * D * 12);
  }
  curBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      curBtns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      cur = b.getAttribute('data-cur');
      moneySpans.forEach(function (s) { s.textContent = cur; });
      calc();
    });
  });
  function link(a, b) { if (a && b) a.addEventListener('input', function () { b.value = a.value; calc(); }); }
  link(leads, leadsR); link(leadsR, leads);
  link(conv, convR); link(convR, conv);
  link(deal, dealR); link(dealR, deal);
  calc();
})();

/* ── Reveal real use-cases only with ?tst=yes ── */
(function () {
  try {
    if (new URLSearchParams(window.location.search).get('tst') === 'yes') {
      document.body.classList.add('tst');
    }
  } catch (e) {}
})();

/* ── Liquid glass: блик следует за курсором по карточке ──
   CSS-переменная --sheen (0..1) задаёт позицию отражения; на hover
   карточка приподнимается, и блик смещается вместе с движением. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SEL = '.case-card, .service-card, .hc-col';
  var raf = null, pending = [];

  function flush() {
    raf = null;
    for (var i = 0; i < pending.length; i++) {
      pending[i][0].style.setProperty('--sheen', pending[i][1]);
    }
    pending.length = 0;
  }

  function queue(el, val) {
    pending.push([el, val]);
    if (!raf) raf = requestAnimationFrame(flush);
  }

  document.addEventListener('pointermove', function (e) {
    var card = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (!card) return;
    var r = card.getBoundingClientRect();
    if (!r.width) return;
    var x = (e.clientX - r.left) / r.width;
    queue(card, Math.max(0, Math.min(1, x)).toFixed(3));
  }, { passive: true });

  document.addEventListener('pointerleave', function (e) {
    var card = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (card) queue(card, '0.5');
  }, true);
})();

/* ── Стеклянный курсор: маленький кружок 5px вместо системного ── */
(function () {
  if (!window.matchMedia) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var dot = document.createElement('div');
  dot.className = 'duck-cursor-dot';
  dot.style.transform = 'translate(-100px,-100px)';
  document.body.appendChild(dot);
  document.documentElement.classList.add('duck-cursor');

  var x = -100, y = -100, raf = null;
  var LINK = 'a, button, input, textarea, select, label, [role="button"], .av, .chip, .tx-dot';

  function draw() {
    raf = null;
    dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }

  document.addEventListener('pointermove', function (e) {
    x = e.clientX; y = e.clientY;
    if (!raf) raf = requestAnimationFrame(draw);
    var over = e.target && e.target.closest ? e.target.closest(LINK) : null;
    dot.classList.toggle('on-link', !!over);
  }, { passive: true });

  document.addEventListener('pointerdown', function () { dot.classList.add('on-link'); }, { passive: true });
  document.addEventListener('pointerup', function () { dot.classList.remove('on-link'); }, { passive: true });

  document.addEventListener('mouseleave', function () {
    dot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    dot.style.opacity = '1';
  });
})();
