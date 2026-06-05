/* ============================================================
   FESTISALE — Main interactions
   - Sticky nav scroll state
   - Mobile menu toggle
   - Scroll reveal (IntersectionObserver)
   - Counter animations
   - Tab switcher
   - Revenue calculator (Pricing page)
   - Contact form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Sticky nav ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.nav-burger');
  const navMobile = document.querySelector('.nav-mobile');
  if (burger && navMobile) {
    burger.addEventListener('click', () => navMobile.classList.toggle('open'));
    navMobile.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navMobile.classList.remove('open'))
    );
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = el => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      el.textContent = prefix + val.toLocaleString('hu-HU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---------- Tab switcher ---------- */
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs = group.querySelectorAll('.tab');
    const contents = group.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.tab;
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        contents.forEach(c => c.classList.toggle('active', c.dataset.tab === id));
      });
    });
  });

  /* ---------- Revenue calculator ---------- */
  const calc = document.getElementById('calc');
  if (calc) {
    const slider = calc.querySelector('#calc-turnover');
    const valueEl = calc.querySelector('#calc-turnover-value');
    const r1 = calc.querySelector('#calc-r1');
    const r2 = calc.querySelector('#calc-r2');
    const winner = calc.querySelectorAll('.calc-result');

    const fmt = n => new Intl.NumberFormat('hu-HU').format(Math.round(n)) + ' Ft';

    const update = () => {
      const turnover = parseInt(slider.value, 10);
      valueEl.textContent = fmt(turnover);

      const standaloneMonthly = turnover * 0.0065;
      const kasszaMonthly = 25000 + turnover * 0.0035;

      r1.textContent = fmt(standaloneMonthly);
      r2.textContent = fmt(kasszaMonthly);

      winner.forEach(w => w.classList.remove('winner'));
      if (standaloneMonthly <= kasszaMonthly) {
        winner[0].classList.add('winner');
      } else {
        winner[1].classList.add('winner');
      }
    };

    slider.addEventListener('input', update);
    update();
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      form.classList.add('hide');
      form.style.display = 'none';
      const success = document.getElementById('form-success');
      if (success) success.classList.add('show');
    });
  }

  /* ---------- Marquee duplication for seamless loop ---------- */
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });
});
