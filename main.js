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

  // ── Particle system ──
  const particleContainer = document.querySelector('.particles');
  if (particleContainer) {
    const colors = ['var(--yellow)', 'var(--pink)', 'var(--yellow)', 'var(--yellow)', 'var(--pink)'];
    for (let i = 0; i < 45; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = (1.5 + Math.random() * 3.5) + 'px';
      p.style.height = p.style.width;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (7 + Math.random() * 16) + 's';
      p.style.animationDelay = -(Math.random() * 20) + 's';
      particleContainer.appendChild(p);
    }

    // Automation glyph particles
    const glyphs = ['→', '◆', '+', '//', '{ }', '▸', '—', '×'];
    for (let i = 0; i < 20; i++) {
      const g = document.createElement('div');
      g.className = 'glyph-particle';
      g.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      g.style.left = Math.random() * 100 + '%';
      g.style.color = Math.random() > 0.55
        ? 'rgba(255,220,0,' + (0.25 + Math.random() * 0.35) + ')'
        : 'rgba(255,0,245,' + (0.2 + Math.random() * 0.3) + ')';
      g.style.animationDuration = (11 + Math.random() * 18) + 's';
      g.style.animationDelay = -(Math.random() * 22) + 's';
      particleContainer.appendChild(g);
    }
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
