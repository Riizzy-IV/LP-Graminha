// ==================== MOBILE NAV TOGGLE ====================
(function () {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

// ==================== HEADER SCROLL STATE ====================
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ==================== ABOUT VIDEO (GOOGLE DRIVE) ====================
(function () {
  const wrapper = document.getElementById('aboutVideo');
  if (!wrapper) return;

  const playBtn = wrapper.querySelector('.about__play-btn');
  const fullscreenBtn = wrapper.querySelector('.about__fullscreen-btn');
  const videoSrc = wrapper.dataset.videoSrc;

  const loadVideo = () => {
    if (wrapper.classList.contains('is-playing')) return;
    const iframe = document.createElement('iframe');
    iframe.src = videoSrc;
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    wrapper.appendChild(iframe);
    wrapper.classList.add('is-playing');
  };

  if (playBtn) {
    playBtn.addEventListener('click', loadVideo);
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      loadVideo();
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen();
      }
    });
  }
})();

// ==================== GALERIA CAROUSEL ====================
(function () {
  const carousel = document.querySelector('.galeria__carousel');
  const tracks = document.querySelectorAll('.galeria__track');
  const prevBtn = document.getElementById('galeriaPrev');
  const nextBtn = document.getElementById('galeriaNext');
  const tabs = document.querySelectorAll('.galeria__tab');

  if (!carousel || !tracks.length || !prevBtn || !nextBtn) return;

  const container = document.querySelector('#galeria .container');
  let activeTrack = document.querySelector('.galeria__track--active') || tracks[0];

  const getStep = (track) => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const firstCard = track.querySelector('.galeria__card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    return cardWidth + gap;
  };

  const sizeTrack = (track) => {
    const cards = track.querySelectorAll('.galeria__card');
    const isMobile = window.innerWidth <= 640;
    const viewportWidth = window.innerWidth;

    if (isMobile) {
      // no side peeks on mobile: one card at a time, aligned to the
      // standard container gutter instead of true edge-to-edge bleed
      const containerRect = container.getBoundingClientRect();
      const containerPadLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0;
      const gutter = containerRect.left + containerPadLeft;
      const contentWidth = containerRect.width - containerPadLeft * 2;
      const cardWidth = contentWidth * 0.92;
      cards.forEach((card) => {
        card.style.width = cardWidth + 'px';
      });
      track.style.paddingLeft = gutter + 'px';
      track.style.paddingRight = gutter + 'px';
      prevBtn.style.left = '12px';
      nextBtn.style.right = '12px';
    } else {
      // center card fully visible, neighboring cards peek on both sides,
      // full-bleed edge to edge of the viewport
      const cardWidth = viewportWidth * 0.62;
      const sidePad = Math.max((viewportWidth - cardWidth) / 2, 0);
      cards.forEach((card) => {
        card.style.width = cardWidth + 'px';
      });
      track.style.paddingLeft = sidePad + 'px';
      track.style.paddingRight = sidePad + 'px';
      prevBtn.style.left = (sidePad - 22) + 'px';
      nextBtn.style.right = (sidePad - 22) + 'px';
    }
  };

  const layoutAll = () => {
    tracks.forEach(sizeTrack);
  };

  const scrollByStep = (direction) => {
    const track = activeTrack;
    const step = getStep(track) * direction;
    const maxScroll = track.scrollWidth - track.clientWidth;
    let target = track.scrollLeft + step;

    if (target > maxScroll - 2) {
      target = 0; // loop back to the start
    } else if (target < 0) {
      target = maxScroll; // loop to the end
    }

    track.scrollTo({ left: target, behavior: 'smooth' });
  };

  nextBtn.addEventListener('click', () => scrollByStep(1));
  prevBtn.addEventListener('click', () => scrollByStep(-1));

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.gallery;
      const nextTrack = document.querySelector(`.galeria__track[data-gallery="${key}"]`);
      if (!nextTrack || nextTrack === activeTrack) return;

      tabs.forEach((t) => t.classList.toggle('galeria__tab--active', t === tab));
      tracks.forEach((t) => t.classList.toggle('galeria__track--active', t === nextTrack));
      activeTrack = nextTrack;
      layoutAll();
    });
  });

  window.addEventListener('resize', layoutAll);
  layoutAll();
})();

// ==================== PLANTAS TABS ====================
(function () {
  const tabsWrap = document.getElementById('plantasTabs');
  const floorplan = document.getElementById('plantasFloorplan');
  const prevBtn = document.querySelector('.plantas__nav-btn--prev');
  const nextBtn = document.querySelector('.plantas__nav-btn:not(.plantas__nav-btn--prev)');

  if (!tabsWrap || !floorplan) return;

  const tabs = Array.from(tabsWrap.querySelectorAll('.plantas__tab'));
  let activeIndex = tabs.findIndex((tab) => tab.classList.contains('plantas__tab--active'));
  if (activeIndex === -1) activeIndex = 0;

  const setActive = (index) => {
    activeIndex = (index + tabs.length) % tabs.length;
    const tab = tabs[activeIndex];

    tabs.forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle('plantas__tab--active', isActive);
      t.querySelector('img').src = isActive
        ? 'assets/icons/icon-tab-active.svg'
        : 'assets/icons/icon-tab-inactive.svg';
    });

    floorplan.src = tab.dataset.img;
    floorplan.alt = 'Planta baixa do apartamento de ' + tab.dataset.label;
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setActive(index));
  });

  if (prevBtn) prevBtn.addEventListener('click', () => setActive(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setActive(activeIndex + 1));
})();

// ==================== LIGHTBOX ====================
(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightbox || !lightboxImg) return;

  let group = [];
  let index = 0;

  const getCaption = (card) => {
    const badge = card.querySelector('.galeria__card-badge');
    if (!badge) return '';
    const parts = Array.from(badge.children)
      .filter((el) => !el.classList.contains('galeria__card-badge-divider'))
      .map((el) => el.textContent.trim());
    return parts.join(' · ');
  };

  const show = () => {
    const card = group[index];
    const img = card.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = getCaption(card);
  };

  const open = (card) => {
    const scope = card.closest('.galeria__track') || document;
    group = Array.from(scope.querySelectorAll('.galeria__card'));
    index = group.indexOf(card);
    if (index === -1) {
      group = [card];
      index = 0;
    }

    show();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const step = (direction) => {
    if (!group.length) return;
    index = (index + direction + group.length) % group.length;
    show();
  };

  document.querySelectorAll('.galeria__card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      open(card);
    });

    const expandBtn = card.querySelector('.galeria__card-expand');
    if (expandBtn) {
      expandBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        open(card);
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => step(1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });
})();
