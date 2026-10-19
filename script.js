(() => {
  'use strict';

  const STORAGE_KEY = 'theme';
  const root = document.documentElement;
  const navbar = document.getElementById('mainNav');
  const navMenu = document.getElementById('navMenu');
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  /* ---------- Theme ---------- */
  const readTheme = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
    } catch (e) {
      return 'dark';
    }
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* storage unavailable: ignore */
    }
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-bs-theme', theme);

    const isDark = theme === 'dark';
        themeToggles.forEach((btn) => {
        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        btn.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
    if (themeMeta) themeMeta.setAttribute('content', isDark ? '#00171f' : '#ffffff');

  };

  applyTheme(readTheme());

  themeToggles.forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
  });
});

  /* ---------- Navbar background on scroll ---------- */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Close mobile menu after clicking a link ---------- */
  document.querySelectorAll('#navMenu .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
  });

  /* ---------- Highlight the active section link ---------- */
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  const sections = document.querySelectorAll('main section[id]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
    navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#contact'));
    }
    }, { passive: true });

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Decorative 15x15 grid (shown if the screenshot is missing) ---------- */
  const buildGrid = (container) => {
    if (!container) return;

    // Small seeded PRNG so the layout is identical on every load
    let seed = 24;
    const random = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 15 * 15; i++) {
      const cell = document.createElement('span');
      cell.className = 'grid-cell';
      const r = random();
      if (r > 0.45 && r <= 0.75) cell.classList.add('plant');
      else if (r > 0.75 && r <= 0.86) cell.classList.add('rabbit');
      else if (r > 0.86 && r <= 0.94) cell.classList.add('bee');
      else if (r > 0.94 && r <= 0.98) cell.classList.add('fox');
      fragment.appendChild(cell);
    }
    container.appendChild(fragment);
  };

  buildGrid(document.getElementById('gridFallback'));
})();