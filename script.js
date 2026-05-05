/* ========================================
   ALEX TORRES DJ - DUAL BRAND SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    const splitHero = document.getElementById('splitHero');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navLogo = document.getElementById('navLogo');
    const brandSwitch = document.getElementById('brandSwitch');
    const switchLabel = document.getElementById('switchLabel');
    const brandATM = document.getElementById('brandATM');
    const brandAXTS = document.getElementById('brandAXTS');
    const contactTag = document.getElementById('contactTag');
    const contactAccent = document.getElementById('contactAccent');
    const contactSubmit = document.getElementById('contactSubmit'); // may be null

    let currentBrand = null;

    // ============================================
    const AXTS_ENABLED = true;
    // ============================================

    // If AXTS is disabled, skip split screen and go straight to ATM
    if (!AXTS_ENABLED) {
        splitHero.classList.add('hidden');
        brandSwitch.style.display = 'none';
    }

    // --- Particles for split hero ---
    document.querySelectorAll('.split-particles').forEach(container => {
        const side = container.dataset.side;
        const colors = side === 'left'
            ? ['var(--atm-primary)', 'var(--atm-secondary)']
            : ['var(--axts-primary)', 'var(--axts-secondary)'];

        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 8 + 5) + 's';
            p.style.animationDelay = (Math.random() * 5) + 's';
            const size = (Math.random() * 2 + 1) + 'px';
            p.style.width = size;
            p.style.height = size;
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(p);
        }
    });

    // --- Enter a brand world ---
    function enterBrand(brand) {
        currentBrand = brand;

        splitHero.classList.add('hidden');
        document.body.classList.remove('brand-atm', 'brand-axts');
        document.body.classList.add(`brand-${brand}`);

        brandATM.classList.toggle('active', brand === 'atm');
        brandAXTS.classList.toggle('active', brand === 'axts');

        navbar.classList.add('visible');

        // Update logo
        navLogo.innerHTML = brand === 'atm'
            ? 'ALEX TORRES <span>MUSIC</span>'
            : '<span>AXTS</span>';

        // Update switch button
        switchLabel.textContent = brand === 'atm' ? 'AXTS' : 'ATM';

        // Update contact section to match brand
        contactAccent.className = brand === 'atm' ? 'accent-atm' : 'accent-axts';
        contactTag.className = brand === 'atm' ? 'section-tag tag-atm' : 'section-tag tag-axts';
        if (contactSubmit) contactSubmit.className = brand === 'atm' ? 'btn btn-atm btn-full' : 'btn btn-axts btn-full';

        // Update nav links to point to correct section IDs
        const suffix = brand === 'axts' ? '-axts' : '';
        navLinks.forEach(link => {
            const text = link.textContent;
            const map = { 'Sobre mí': 'about', 'Contenido': 'content', 'Galería': 'gallery', 'Eventos': 'events', 'Contacto': 'contact' };
            if (map[text]) {
                let id;
                if (text === 'Contacto') {
                    id = 'contact';
                } else if (text === 'Contenido') {
                    id = brand === 'axts' ? 'music-axts' : 'content';
                } else {
                    id = map[text] + suffix;
                }
                link.setAttribute('href', `#${id}`);
            }
        });

        window.scrollTo({ top: 0, behavior: 'instant' });

        // Re-init scroll reveals
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
            initCounters();
        }, 200);
    }

    // --- Return to split screen ---
    function returnToSplit() {
        brandATM.classList.remove('active');
        brandAXTS.classList.remove('active');
        navbar.classList.remove('visible');
        document.body.classList.remove('brand-atm', 'brand-axts');
        splitHero.classList.remove('hidden');
        currentBrand = null;
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // --- Event listeners: Split hero ---
    document.getElementById('splitLeft').addEventListener('click', () => enterBrand('atm'));
    document.getElementById('splitRight').addEventListener('click', () => enterBrand('axts'));

    // Prevent double-fire from button inside the side
    document.querySelectorAll('.split-enter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            enterBrand(btn.dataset.target);
        });
    });

    // Brand switch & logo
    brandSwitch.addEventListener('click', () => {
        enterBrand(currentBrand === 'atm' ? 'axts' : 'atm');
    });

    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        if (AXTS_ENABLED) {
            returnToSplit();
        } else {
            // AXTS disabled: just scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // --- Mobile menu ---
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Active link on scroll ---
    window.addEventListener('scroll', () => {
        if (!currentBrand) return;

        const activeBrand = currentBrand === 'atm' ? brandATM : brandAXTS;
        const sections = [...activeBrand.querySelectorAll('.section'), document.getElementById('contact')];
        let current = '';

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    });

    // --- Scroll reveal ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.section-header, .about-grid, .music-card, .content-card, .gallery-item, .event-card, .contact-card'
    ).forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // --- Counter animation ---
    function initCounters() {
        if (!currentBrand) return;
        const section = currentBrand === 'atm' ? brandATM : brandAXTS;

        section.querySelectorAll('.stat-number[data-target]').forEach(counter => {
            if (counter.dataset.counted) return;

            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const target = parseInt(counter.dataset.target);
                    const duration = 1800;
                    const start = performance.now();

                    (function update(now) {
                        const progress = Math.min((now - start) / duration, 1);
                        counter.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
                        if (progress < 1) requestAnimationFrame(update);
                        else { counter.textContent = target; counter.dataset.counted = 'true'; }
                    })(performance.now());

                    obs.unobserve(counter);
                });
            }, { threshold: 0.5 });

            obs.observe(counter);
        });
    }

    // --- Smooth scroll ---
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor || anchor.getAttribute('href') === '#') return;

        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- Gallery load more / less (per venue) ---
    document.querySelectorAll('.gallery-load-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const venue = btn.dataset.venue;
            const grid = document.querySelector(`.gallery-venue-grid[data-venue="${venue}"]`);
            const collapseBtn = document.querySelector(`.gallery-collapse-btn[data-venue="${venue}"]`);
            if (grid) {
                grid.classList.add('gallery-expanded');
                btn.style.display = 'none';
                if (collapseBtn) collapseBtn.style.display = '';
                grid.querySelectorAll('.gallery-hidden').forEach(el => {
                    revealObserver.observe(el);
                });
            }
        });
    });

    document.querySelectorAll('.gallery-collapse-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const venue = btn.dataset.venue;
            const grid = document.querySelector(`.gallery-venue-grid[data-venue="${venue}"]`);
            const loadBtn = document.querySelector(`.gallery-load-btn[data-venue="${venue}"]`);
            if (grid) {
                grid.classList.remove('gallery-expanded');
                btn.style.display = 'none';
                if (loadBtn) loadBtn.style.display = '';
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;
        const img = item.querySelector('img');
        if (!img) return;
        e.preventDefault();
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });

    // --- Auto-enter ATM if AXTS is disabled ---
    if (!AXTS_ENABLED) {
        enterBrand('atm');
    }
});
