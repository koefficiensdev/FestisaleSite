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

  /* ============================================================
     New components — wireframe v2
     ============================================================ */

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    const toggle = () => item.classList.toggle('open');
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ---------- Sticky bottom CTA bar ---------- */
  const stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    let dismissed = false;
    stickyCta.querySelector('.sticky-cta-close')?.addEventListener('click', () => {
      dismissed = true;
    });
    const onStickyScroll = () => {
      if (dismissed) return;
      // Show after the user scrolls past the hero (~600px) and isn't at the very bottom
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight - 200;
      if (y > 600 && y < max) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', onStickyScroll, { passive: true });
    onStickyScroll();
  }

  /* ---------- Hero terminals — subtle mouse parallax ---------- */
  const heroStage = document.querySelector('.hero-stage');
  if (heroStage && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const terms = heroStage.querySelectorAll('.hero-term');
    heroStage.addEventListener('mousemove', e => {
      const rect = heroStage.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      terms.forEach((t, i) => {
        const depth = (i + 1) * 8;
        t.style.transform = `translate(${dx * depth}px, ${dy * depth}px) rotate(${dx * 2}deg)`;
      });
    });
    heroStage.addEventListener('mouseleave', () => {
      terms.forEach(t => { t.style.transform = ''; });
    });
  }

  /* ============================================================
     Feature Explorer (Kassza page)
     ============================================================ */
  const baseGrid = document.getElementById('baseGrid');
  const addonContainer = document.getElementById('addonCategories');
  if (baseGrid && addonContainer) {

    const baseFeatures = [
      { name: 'NAV adóügyi integráció', icon: '🧾', tag: 'törvényi megfelelés' },
      { name: 'Bankkártya + készpénz', icon: '💳', tag: 'minden fizetési mód' },
      { name: 'Készletkezelés', icon: '📦', tag: 'vonalkód olvasóval' },
      { name: 'Napi / havi riportok', icon: '📊', tag: 'forgalmi kimutatások' },
      { name: 'Online számla / nyugta', icon: '🧾', tag: 'NAV-kompatibilis' },
      { name: 'Több felhasználó', icon: '👥', tag: 'jogosultsági szintek' },
      { name: '24/7 magyar support', icon: '🎧', tag: 'telefon · e-mail · chat' },
      { name: 'Termékadatbázis', icon: '🗄️', tag: 'korlátlan termék' },
      { name: 'Automatikus napi zárás', icon: '🔒', tag: 'érintésmentes elszámolás' },
      { name: 'Több fizetési mód', icon: '💰', tag: 'utalvány, SZÉP, kupon' },
      { name: 'Számla módosítás', icon: '✏️', tag: 'stornó, visszáru' },
      { name: 'Offline mód', icon: '📡', tag: 'internet nélkül is megy' }
    ];

    const addonCategories = [
      {
        label: '💰 Értékesítés és pénzügy',
        id: 'sales',
        items: [
          { name: 'Akciók és kedvezmények', icon: '🏷️', tag: 'időzített promóciók' },
          { name: 'Visszáru kezelés', icon: '↩️', tag: 'visszatérítési folyamat' },
          { name: 'Proforma nyomtatás', icon: '🖨️', tag: 'ajánlat / díjbekérő' },
          { name: 'Előrendelés kezelés', icon: '⏱️', tag: 'foglaláshoz kapcsolva' },
          { name: 'Mérlegkapcsolat', icon: '⚖️', tag: 'pékség, zöldséges' },
          { name: 'Pénztárgépkapcsolat', icon: '💻', tag: 'meglévő géphez' },
          { name: 'Receptúrák / félkész', icon: '🍳', tag: 'étterem konyha' }
        ]
      },
      {
        label: '⭐ Vendég- és vásárlókezelés',
        id: 'guest',
        items: [
          { name: 'Törzsvásárlói rendszer', icon: '🌟', tag: 'pont, szint, jutalom', soon: true },
          { name: 'Ajándékkártya', icon: '🎁', tag: 'értékkártya kezelés', soon: true },
          { name: 'Asztalkezelés', icon: '🪑', tag: 'éttermi asztal és felszolgálás' },
          { name: 'QR kódos étlap', icon: '📲', tag: 'asztalnál rendelés', soon: true },
          { name: 'Online asztalfoglalás', icon: '📅', tag: 'publikus foglalási felület', soon: true },
          { name: 'Vendég kijáró', icon: '🚪', tag: 'éttermi számlázás' },
          { name: 'Személyi fogyasztás', icon: '👤', tag: 'dolgozói számla' }
        ]
      },
      {
        label: '🚀 Szállítás és online integráció',
        id: 'delivery',
        items: [
          { name: 'Foodora integráció', icon: '🍔', tag: 'rendelések automatikus importja' },
          { name: 'Wolt integráció', icon: '⚡', tag: 'valós idejű szinkron' },
          { name: 'Wolt Direct', icon: '🔄', tag: 'saját futárhoz' },
          { name: 'Falatozz.hu integráció', icon: '🍽️', tag: 'hazai platform' },
          { name: 'Kiszállítás kezelés', icon: '🚚', tag: 'futárok, zónák, időablak' }
        ]
      },
      {
        label: '⚙️ Haladó és speciális modulok',
        id: 'advanced',
        items: [
          { name: 'Többnyelvűség', icon: '🌍', tag: 'idegenforgalomhoz' },
          { name: 'Konyhai kijáró (KDS)', icon: '👨‍🍳', tag: 'konyhai kijelző' },
          { name: 'Sorszám kijáró', icon: '🔢', tag: 'várótermi kijelző' },
          { name: 'Haladó analitika', icon: '📈', tag: 'kohorszok, trendek' },
          { name: 'Külső eszköz API', icon: '🔌', tag: 'fejlesztői hozzáférés' }
        ]
      }
    ];

    // Render base features
    baseFeatures.forEach(f => {
      const card = document.createElement('div');
      card.className = 'feat-card included';
      card.innerHTML = `
        <div class="feat-icon inc">${f.icon}</div>
        <div class="feat-text">
          <div class="feat-name">${f.name}</div>
          <div class="feat-tag">${f.tag}</div>
        </div>`;
      baseGrid.appendChild(card);
    });

    // Render addon categories
    addonCategories.forEach(cat => {
      const wrap = document.createElement('div');
      wrap.className = 'feat-category';
      wrap.innerHTML = `
        <div class="cat-label">${cat.label}</div>
        <div class="feat-grid" id="grid-${cat.id}"></div>`;
      addonContainer.appendChild(wrap);
      const grid = wrap.querySelector(`#grid-${cat.id}`);
      cat.items.forEach(f => {
        const card = document.createElement('div');
        card.className = 'feat-card addon';
        card.dataset.active = '0';
        card.innerHTML = `
          <div class="feat-icon off">${f.icon}</div>
          <div class="feat-text">
            <div class="feat-name">${f.name}${f.soon ? '<span class="feat-badge">hamarosan</span>' : ''}</div>
            <div class="feat-tag">${f.tag}</div>
          </div>`;
        card.addEventListener('click', () => toggleAddon(card));
        grid.appendChild(card);
      });
    });

    function toggleAddon(el) {
      const on = el.dataset.active === '1';
      el.dataset.active = on ? '0' : '1';
      el.classList.toggle('active', !on);
      const ic = el.querySelector('.feat-icon');
      if (ic) ic.className = `feat-icon ${!on ? 'on' : 'off'}`;
      updateCounter(!on);
    }

    function updateCounter(addedNow) {
      const active = document.querySelectorAll('.feat-card.addon.active').length;
      const cntEl = document.getElementById('cntExtra');
      const summary = document.getElementById('counterSummary');
      if (cntEl) {
        cntEl.textContent = active;
        if (addedNow) {
          cntEl.classList.add('bump');
          setTimeout(() => cntEl.classList.remove('bump'), 250);
        }
      }
      if (summary) {
        summary.textContent = `${baseFeatures.length + active} funkció összesen`;
        summary.classList.toggle('visible', active > 0);
      }
    }
  }

  /* ============================================================
     Quick order form (Kassza page) + success overlay
     ============================================================ */
  const quickPick = document.getElementById('qfPick');
  if (quickPick) {
    quickPick.querySelectorAll('.qf-pick-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        quickPick.querySelectorAll('.qf-pick-opt').forEach(o => o.classList.remove('sel'));
        opt.classList.add('sel');
      });
    });
  }

  const quickForm = document.getElementById('quickOrderForm');
  const successOverlay = document.getElementById('successOverlay');
  if (quickForm && successOverlay) {
    quickForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('qfName').value.trim();
      const phone = document.getElementById('qfPhone').value.trim();
      const consent = document.getElementById('qfConsent').checked;
      if (!name) { flashField('qfName'); return; }
      if (!phone) { flashField('qfPhone'); return; }
      if (!consent) {
        const lbl = document.querySelector('.qf-consent');
        if (lbl) { lbl.style.color = 'var(--color-orange-dark)'; setTimeout(() => lbl.style.color = '', 1800); }
        return;
      }
      successOverlay.classList.add('show');
      quickForm.reset();
      // Re-select default pick
      quickPick?.querySelectorAll('.qf-pick-opt').forEach((o, i) => o.classList.toggle('sel', i === 0));
    });

    // Close overlay on backdrop click / Esc
    successOverlay.addEventListener('click', e => {
      if (e.target === successOverlay) successOverlay.classList.remove('show');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') successOverlay.classList.remove('show');
    });
  }

  function flashField(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = 'var(--color-orange-dark)';
    el.focus();
    setTimeout(() => { el.style.borderColor = ''; }, 1800);
  }

  /* ---------- Product galleries (thumbnail switch) ---------- */
  document.querySelectorAll('[data-gallery]').forEach(visual => {
    const mainImg = visual.querySelector('.product-main-img');
    const thumbs = visual.querySelectorAll('.product-thumb');
    if (!mainImg || thumbs.length === 0) return;

    // Preload thumb targets so the swap is instant
    thumbs.forEach(t => {
      const src = t.dataset.src;
      if (src) { const i = new Image(); i.src = src; }
    });

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.src;
        if (!src || mainImg.getAttribute('src') === src) return;

        // Crossfade: dim → swap → restore
        visual.classList.add('is-switching');
        const swap = () => {
          mainImg.src = src;
          requestAnimationFrame(() => visual.classList.remove('is-switching'));
        };
        // Wait for the fade-out to register, then swap on next frame
        setTimeout(swap, 220);

        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  });
});
