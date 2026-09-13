/**
 * Yuvaneshwaran Roofing Solutions - Main Interactive Script
 * High performance, zero external framework dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initAnimatedCounters();
  initProjectFilters();
  initProjectModal();
  initContactForm();
});

/* ==========================================================================
   1. NAVBAR & SCROLL SPY
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight + 5;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const scrollPosition = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPosition >= top && scrollPosition < top + height) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}

/* ==========================================================================
   2. MOBILE DRAWER MENU
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .btn-drawer-close');

  if (!hamburgerBtn || !drawer || !overlay) return;

  const toggleMenu = (open) => {
    const isOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    drawer.classList.toggle('open', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  };

  hamburgerBtn.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   3. SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. ANIMATED COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target') || '0');
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const duration = 1800; // ms
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = progress === 1 ? target : (target * easeProgress);

    let formatted = decimals > 0 
      ? current.toFixed(decimals) 
      : Math.round(current).toLocaleString('en-IN');

    el.textContent = prefix + formatted + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   5. PROJECT PORTFOLIO FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECT MODAL / DETAIL EXPANDER
   ========================================================================== */
const projectData = {
  'safran': {
    title: 'M/s. Safran Aircraft Engine Pvt Ltd',
    location: 'Shamshabad, Hyderabad',
    value: '₹1.52 Crores',
    span: 'Building span 165m x 50m',
    scope: 'Roll forming & fixing of 0.6mm thk standing seaming sheet work with 90mm thick Rock wool insulation (60kg/cu.m) & weldmesh + fixing of double skin wall cladding sheet with 60mm thick rock wool (60kg/cu.m) with mesh.',
    specs: [
      '27,500 Sq.M Standing Seam Roofing',
      '11,500 Sq.M Double Skin Wall Cladding',
      '18,000 Running Metres Flashing Installed',
      'High-Density 90mm Rockwool Insulation with Weldmesh'
    ]
  },
  'reliance-surat': {
    title: 'M/s. Reliance Food Products Pvt Ltd',
    location: 'Surat, Gujarat',
    value: '₹3.50 Crores + ₹1.80 Crores (Total ₹5.30 Cr)',
    span: 'Building 1: 200m x 200m | Building 2: 100m x 120m',
    scope: 'Complete erection of PEB steel work, Mezzanine, deck sheet, stud rod fixing & roof standing seam sheet, wall PUF cladding, gutter & downpipe work. SSR sheet roll forming & fixing with crawler lifter machine. Successfully executed during 3 months heavy rainfall.',
    specs: [
      '3,500 M.T Structural PEB Steel Erection',
      '65,000 Sq.M Standing Seam Roll Forming with Lifter',
      'Heavy-duty Mezzanine & Composite Deck Sheets',
      'PUF Insulated Panel Wall Cladding'
    ]
  },
  'reliance-kurnool': {
    title: 'M/s. Reliance Food Products Pvt Ltd',
    location: 'Kurnool, Andhra Pradesh',
    value: '₹1.70 Crores',
    span: 'Building span 90m x 110m',
    scope: 'Erection of PEB steel work, Mezzanine floor, deck sheet, stud rod fixing, roof standing seam sheet, wall cladding, and complete rainwater gutter & downpipe system with mechanized equipment.',
    specs: [
      '900 M.T Heavy Industrial PEB Steel Work',
      'Standing Seam Roofing System',
      'Full Mezzanine & Structural Steel Decking',
      'Turnkey Rainwater Management System'
    ]
  },
  'adani': {
    title: 'M/s. Adani Food Product Pvt Ltd',
    location: 'Malur, Bangalore, Karnataka',
    value: '₹50 Lakhs',
    span: 'Building span 35m x 95m',
    scope: 'Erection of PEB steel work, roof sheeting, wall cladding, gutter and down pipe work with specialized equipment.',
    specs: [
      '105 M.T PEB Structural Framework',
      'High-Strength Roof Sheet Installation',
      'Industrial Wall Cladding & Gutter Profiles',
      'Executed strictly per Client Specs'
    ]
  },
  'united-motos': {
    title: 'M/s. United Motos',
    location: 'Bangalore, Karnataka',
    value: '₹62 Lakhs + ₹25 Lakhs (Total ₹87 Lakhs)',
    span: 'Building span 140m x 200m',
    scope: 'Fixing of single skin insulation 20mm thk XLPE sheet & 0.5mm roll forming of standing seaming sheet work (85m continuous sheet length) + fixing of coated galvalume Monitor roof & cladding screw down sheet, louvers & flashings.',
    specs: [
      '22,000 Sq.M Continuous Standing Seam (85m Length)',
      '9,000 Sq.M Monitor Roof, Canopy & Wall Cladding',
      '20mm High-Performance XLPE Thermal Insulation',
      'Engineered Aerodynamic Louvers & Flashings'
    ]
  },
  'wildcraft': {
    title: 'M/s. Wild Craft Pvt Ltd',
    location: 'Sira, Karnataka',
    value: '₹55 Lakhs',
    span: 'Building span 160m x 160m',
    scope: 'Fixing of single skin insulation 20mm thk XLPE sheet & 0.5mm roll forming of standing seaming sheet work with continuous 85m sheet length. Peak execution of 2,000 sq.m roll formed and 1,500 sq.m fixed per day with 25 specialized personnel.',
    specs: [
      '26,200 Sq.M Standing Seam Roofing',
      '85m Long Continuous Jointless Sheet Panels',
      'Peak Roll-Forming Rate: 2,000 Sq.M / Day',
      '20mm XLPE Thermal Insulation Barrier'
    ]
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalBody = document.querySelector('.modal-body-content');
  const projectCards = document.querySelectorAll('.project-card[data-project-id]');

  if (!modal || !modalCloseBtn || !modalBody) return;

  const openModal = (id) => {
    const data = projectData[id];
    if (!data) return;

    let specsHtml = data.specs.map(s => 
      '<li style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.5rem; font-size:0.92rem;">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' +
        '<span>' + s + '</span>' +
      '</li>'
    ).join('');

    modalBody.innerHTML = 
      '<div style="margin-bottom: 1.25rem;">' +
        '<span style="background: rgba(245, 166, 35, 0.15); color: #C67800; padding: 0.25rem 0.75rem; border-radius: 9999px; font-family: var(--font-ui); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em;">Verified Client Showcase</span>' +
        '<h3 style="font-family: var(--font-ui); font-size: 1.6rem; color: #0A1F3D; margin-top: 0.65rem; margin-bottom: 0.35rem; letter-spacing: 0.01em;">' + data.title + '</h3>' +
        '<p style="color: #64748B; font-size: 0.95rem; font-weight: 500;">📍 ' + data.location + ' &nbsp;|&nbsp; 💰 <strong>' + data.value + '</strong></p>' +
      '</div>' +
      '<div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem;">' +
        '<h4 style="font-family: var(--font-ui); font-size: 0.85rem; text-transform: uppercase; color: #0A1F3D; margin-bottom: 0.45rem; font-weight: 700; letter-spacing: 0.02em;">Building Span & Dimensions</h4>' +
        '<p style="color: #334155; font-weight: 600;">' + data.span + '</p>' +
      '</div>' +
      '<div style="margin-bottom: 1.5rem;">' +
        '<h4 style="font-family: var(--font-ui); font-size: 0.95rem; text-transform: uppercase; color: #0A1F3D; margin-bottom: 0.6rem; font-weight: 700; letter-spacing: 0.02em;">Detailed Scope & Execution Description</h4>' +
        '<p style="color: #334155; line-height: 1.65; font-size: 0.95rem;">' + data.scope + '</p>' +
      '</div>' +
      '<div>' +
        '<h4 style="font-family: var(--font-ui); font-size: 0.95rem; text-transform: uppercase; color: #0A1F3D; margin-bottom: 0.75rem; font-weight: 700; letter-spacing: 0.02em;">Key Technical Highlights</h4>' +
        '<ul style="list-style:none; padding:0; margin:0;">' + specsHtml + '</ul>' +
      '</div>' +
      '<div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">' +
        '<a href="https://wa.me/918754446172?text=Hello%20Hariprabu,%20I%20reviewed%20your%20project%20with%20' + encodeURIComponent(data.title) + '%20and%20would%20like%20to%20discuss%20a%20similar%20PEB/Roofing%20project." ' +
           'target="_blank" class="btn btn-primary" style="flex:1;">' +
          'Discuss Similar Project on WhatsApp' +
        '</a>' +
      '</div>';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') return;
      const id = card.getAttribute('data-project-id');
      if (id) openModal(id);
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. CONTACT FORM (Client Side Only)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successBanner = document.getElementById('contactSuccessBanner');

  if (!form || !successBanner) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const service = form.querySelector('[name="service"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    const waText = 'Hello Hariprabu M (Yuvaneshwaran Roofing Solutions),%0A%0A*Name:* ' + encodeURIComponent(name) + '%0A*Phone:* ' + encodeURIComponent(phone) + '%0A*Requirement:* ' + encodeURIComponent(service) + '%0A*Details:* ' + encodeURIComponent(message || 'Looking for an initial discussion & quote');
    const waUrl = 'https://wa.me/918754446172?text=' + waText;

    successBanner.style.display = 'block';
    successBanner.innerHTML = 
      '<div style="display:flex; align-items:flex-start; gap:0.75rem;">' +
        '<span style="font-size:1.4rem;">✅</span>' +
        '<div>' +
          '<strong>Thank you, ' + name + '!</strong> Your inquiry has been formatted.' +
          '<div style="margin-top:0.75rem;">' +
            '<a href="' + waUrl + '" target="_blank" class="btn btn-primary" style="padding:0.5rem 1.25rem; font-size:0.85rem;">' +
              'Click Here to Send via WhatsApp Immediately' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    form.reset();
  });
}