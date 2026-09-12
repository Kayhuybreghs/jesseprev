/* Native navigation and disclosure content work before enhancement.
   Motion is event-driven and always follows the user's reduced-motion preference. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 899px)');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigatie');
  const header = document.querySelector('.site-header');
  let anchorScrollUntil = 0;

  function setMenu(open, restoreFocus = false) {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    navigation.classList.toggle('is-open', open);
    if (restoreFocus) menuButton.focus();
  }

  if (menuButton && navigation) {
    document.documentElement.classList.add('js-enabled');
    menuButton.hidden = false;
    menuButton.addEventListener('click', () => {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    document.addEventListener('click', event => {
      if (mobile.matches && !event.target.closest('.header-inner')) setMenu(false);
    });
    mobile.addEventListener('change', () => {
      const shouldRestore = mobile.matches && navigation.contains(document.activeElement);
      setMenu(false, shouldRestore);
    });
  }

  // Keep hash navigation native while placing keyboard focus at its destination.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    anchorScrollUntil = performance.now() + 1400;
    setMenu(false);
    revealAncestors(target);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
  if (navigation) navigation.addEventListener('click', event => {
    if (event.target.closest('a') && mobile.matches) {
      const external = !event.target.closest('a').getAttribute('href').startsWith('#');
      setMenu(false, external);
    }
  });

  const revealElements = [...document.querySelectorAll('[data-reveal]')];
  let revealObserver;
  function revealAncestors(element) {
    let node = element;
    while (node && node !== document.documentElement) {
      if (node.hasAttribute?.('data-reveal')) {
        node.classList.add('is-visible', 'reveal-now');
        revealObserver?.unobserve(node);
      }
      node = node.parentElement;
    }
  }
  document.addEventListener('focusin', event => {
    revealAncestors(event.target);
    if (mobile.matches && !event.target.closest('.header-inner')) setMenu(false);
  });

  function configureReveals() {
    revealObserver?.disconnect();
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('reveal-ready');
      revealElements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -25px 0px' });
    revealElements.forEach(element => {
      if (!element.classList.contains('is-visible')) revealObserver.observe(element);
    });
    document.documentElement.classList.add('reveal-ready');
  }

  const services = [...document.querySelectorAll('.service')];
  const serviceImages = [...document.querySelectorAll('[data-service-image]')];
  const imageStage = document.querySelector('.service-image-stage');
  const caption = document.querySelector('.image-caption');
  const imageIndex = document.querySelector('.image-index');
  const descriptions = [
    ['Een frisse basis voor buiten.', 'Sfeerbeeld van een verzorgde tuin'],
    ['Met aandacht weer in vorm.', 'Sfeerbeeld van anonieme handen die een haag snoeien'],
    ['Ruimte om te groeien.', 'Sfeerbeeld van bloeiende planten en siergrassen']
  ];
  const transitions = new Map();
  const desiredOpen = new Map(services.map(service => [service, service.open]));
  let manualServices = false;
  let lastAutoService = 0;
  let lastAutoScrollY = null;
  const isServiceOpen = service => transitions.has(service) ? desiredOpen.get(service) : service.open;

  function selectImage(index) {
    serviceImages.forEach(image => image.classList.toggle('is-active', image.dataset.serviceImage === String(index)));
    if (imageStage) imageStage.setAttribute('aria-label', descriptions[index][1]);
    if (caption) caption.textContent = descriptions[index][0];
    if (imageIndex) imageIndex.textContent = String(index + 1).padStart(2, '0') + ' — 03';
  }

  function setService(service, open) {
    const startHeight = service.getBoundingClientRect().height;
    const previous = transitions.get(service);
    if (previous) {
      previous.onfinish = null;
      previous.cancel();
      transitions.delete(service);
    }
    desiredOpen.set(service, open);
    const summary = service.querySelector('summary');
    const panel = service.querySelector('.service-panel');
    if (!open && panel.contains(document.activeElement)) summary.focus();
    panel.inert = !open;
    if (open) selectImage(Number(service.dataset.service));

    const finish = () => {
      service.open = open;
      service.style.height = '';
      service.style.overflow = '';
      panel.inert = false;
      transitions.delete(service);
      scheduleScroll();
    };
    if (reducedMotion.matches || typeof service.animate !== 'function') {
      finish();
      return;
    }

    // Temporarily measure the natural target height, then animate from the current
    // visual height. Cancelling an interrupted transition never leaves a stale size.
    service.style.height = '';
    service.open = open;
    const endHeight = service.getBoundingClientRect().height;
    service.open = true;
    service.style.height = startHeight + 'px';
    service.style.overflow = 'hidden';
    const animation = service.animate(
      { height: [startHeight + 'px', endHeight + 'px'] },
      { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
    );
    transitions.set(service, animation);
    animation.onfinish = () => {
      finish();
      animation.cancel();
    };
  }

  services.forEach(service => {
    service.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      manualServices = true;
      const open = !isServiceOpen(service);
      if (open) services.forEach(other => {
        if (other !== service && isServiceOpen(other)) setService(other, false);
      });
      setService(service, open);
    });
  });

  const root = document.documentElement;
  const story = document.querySelector('.scroll-story');
  const stage = document.querySelector('.story-stage');
  const canvas = document.querySelector('.story-canvas');
  const photos = [...document.querySelectorAll('.story-photo')];
  const intro = document.querySelector('.story-intro');
  const galleryCopy = document.querySelector('.story-gallery-copy');
  const chapter = document.querySelector('.story-chapter');
  const shade = document.querySelector('.story-shade');
  const storyNav = document.querySelector('.story-nav');
  const storyButtons = [...document.querySelectorAll('[data-story-step]')];
  const readingProgress = document.querySelector('.reading-progress');
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const mix = (a, b, p) => a + (b - a) * p;
  const easeRange = (p, from, to) => {
    const t = clamp((p - from) / (to - from));
    return t * t * (3 - 2 * t);
  };
  let scrollFrame = 0;
  let geometry = null;
  let currentStoryProgress = 0;
  let focusedStoryProgress = null;
  let lastWidth = 0;

  function restoreStory() {
    root.classList.remove('story-motion');
    root.style.removeProperty('--stage-h');
    root.style.removeProperty('--story-run');
    [...photos, intro, galleryCopy, chapter, shade].forEach(element => {
      element.removeAttribute('style');
      element.inert = false;
    });
    photos.forEach(photo => {
      photo.querySelector('figcaption').style.opacity = '';
      photo.querySelector('.photo-open').style.opacity = '';
    });
    canvas.inert = false;
    storyNav.hidden = true;
    geometry = null;
    focusedStoryProgress = null;
  }

  function configureStory() {
    const focusedButton = document.activeElement.closest('[data-story-step]');
    const restoreStepFocus = () => {
      if (!focusedButton) return;
      if (geometry) focusedButton.focus({ preventScroll: true });
      else {
        const step = Number(focusedButton.dataset.storyStep);
        const destination = step === 0 ? intro : step === 1 ? chapter : galleryCopy;
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
      }
    };
    restoreStory();
    lastWidth = window.innerWidth;
    // The static composition is also the text-zoom and short-landscape fallback.
    if (reducedMotion.matches || parseFloat(getComputedStyle(root).fontSize) > 20 ||
        !CSS.supports('position', 'sticky')) { restoreStepFocus(); return; }
    root.classList.add('story-motion');
    const h = stage.clientHeight;
    if (h < (mobile.matches ? 530 : 620)) { restoreStory(); restoreStepFocus(); return; }
    const w = stage.clientWidth;
    const headerHeight = header.getBoundingClientRect().height;
    root.style.setProperty('--stage-h', h + 'px');
    root.style.setProperty('--story-run', h * 1.7 + 'px');
    geometry = {
      w, h, headerHeight, run: h * 1.7,
      top: story.getBoundingClientRect().top + window.scrollY,
      desktop: !mobile.matches
    };
    storyNav.hidden = false;
    currentStoryProgress = clamp((window.scrollY - geometry.top + headerHeight) / geometry.run);
    paintStory(currentStoryProgress);
    restoreStepFocus();
    scheduleScroll();
  }

  const rect = (x, y, w, h, rotation = 0) => ({ x, y, w, h, rotation });
  function blendRect(a, b, p) {
    return Object.fromEntries(Object.keys(a).map(key => [key, mix(a[key], b[key], p)]));
  }
  function placePhoto(photo, box, opacity, rounding) {
    photo.style.width = box.w.toFixed(2) + 'px';
    photo.style.height = box.h.toFixed(2) + 'px';
    photo.style.transform = 'translate3d(' + box.x.toFixed(2) + 'px,' + box.y.toFixed(2) +
      'px,0) rotate(' + box.rotation.toFixed(2) + 'deg)';
    photo.style.opacity = opacity.toFixed(3);
    photo.style.borderRadius = rounding.toFixed(1) + 'px';
  }
  function showLayer(layer, opacity, y = 0) {
    layer.style.opacity = opacity.toFixed(3);
    layer.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0)';
    const hidden = opacity < .95;
    layer.inert = hidden && !layer.contains(document.activeElement);
    layer.style.pointerEvents = hidden ? 'none' : '';
  }

  function paintStory(progress) {
    const { w, h, desktop } = geometry;
    const unfold = easeRange(progress, .10, .48);
    const dock = easeRange(progress, .62, .94);
    const initial = rect(0, 0, w, h);
    const initialSide = rect(w * .06, h * .05, w * .88, h * .9);
    const gallery = desktop ? [
      rect(w * .32, h * .24, w * .36, h * .58, -3),
      rect(w * .055, h * .28, w * .31, h * .51, -12),
      rect(w * .65, h * .25, w * .30, h * .52, 11)
    ] : [
      rect(w * .22, h * .29, w * .56, h * .43, -4),
      rect(-w * .065, h * .34, w * .49, h * .37, -14),
      rect(w * .64, h * .31, w * .47, h * .39, 12)
    ];
    const destination = desktop
      ? rect(w * .055, h * .12, w * .42, h * .72)
      : rect(22, 22, w - 44, h * .36);
    placePhoto(photos[0], blendRect(blendRect(initial, gallery[0], unfold), destination, dock), 1, 4 + unfold * 3);
    [1, 2].forEach(i => {
      const sideEnd = rect(i === 1 ? -w * .7 : w * 1.1, h * .25, w * .35, h * .45, i === 1 ? -25 : 25);
      placePhoto(photos[i], blendRect(blendRect(initialSide, gallery[i], unfold), sideEnd, dock),
        easeRange(progress, .14, .32) * (1 - easeRange(progress, .63, .85)), 7);
    });
    const introOpacity = 1 - easeRange(progress, .05, .23);
    const galleryOpacity = easeRange(progress, .26, .42) * (1 - easeRange(progress, .61, .76));
    const chapterOpacity = easeRange(progress, .76, .94);
    showLayer(intro, introOpacity, -35 * (1 - introOpacity));
    showLayer(galleryCopy, galleryOpacity, 20 * (1 - galleryOpacity));
    showLayer(chapter, chapterOpacity, 22 * (1 - chapterOpacity));
    shade.style.opacity = introOpacity.toFixed(3);
    const photoControlsVisible = progress > .35 && progress < .69;
    canvas.inert = !photoControlsVisible && !canvas.contains(document.activeElement);
    photos.forEach(photo => {
      photo.querySelector('figcaption').style.opacity = String(easeRange(progress, .27, .43));
      photo.querySelector('.photo-open').style.opacity = photoControlsVisible ? '1' : '0';
    });
    const selected = progress < .25 ? 0 : progress < .76 ? 1 : 2;
    storyButtons.forEach((button, index) => {
      if (index === selected) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }

  // Focused content stays stable while it is being operated with a keyboard.
  document.addEventListener('focusin', event => {
    const inMovingContent = event.target.closest('.story-layer, .story-canvas');
    focusedStoryProgress = inMovingContent && geometry ? currentStoryProgress : null;
    scheduleScroll();
  });
  document.addEventListener('focusout', () => {
    queueMicrotask(() => {
      if (!document.activeElement.closest('.story-layer, .story-canvas')) focusedStoryProgress = null;
      scheduleScroll();
    });
  });
  storyButtons.forEach(button => button.addEventListener('click', () => {
    if (!geometry) return;
    focusedStoryProgress = null;
    window.scrollTo({
      top: geometry.top - geometry.headerHeight + Number(button.dataset.storyStep) * geometry.run,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  }));

  function advanceServices(summaryPositions, viewportHeight) {
    if (reducedMotion.matches || manualServices || performance.now() < anchorScrollUntil ||
        document.activeElement.closest('.service-list')) return;
    // Closing one row moves the next heading upward. Require new user scrolling
    // before progressing again, so a layout change cannot skip an entire service.
    if (lastAutoScrollY !== null && window.scrollY - lastAutoScrollY < viewportHeight * .24) return;
    const next = lastAutoService + 1;
    const position = summaryPositions[next];
    if (!position || position.top >= viewportHeight * .64 || position.bottom <= 0) return;
    lastAutoService = next;
    lastAutoScrollY = window.scrollY;
    services.forEach((service, index) => {
      if (isServiceOpen(service) !== (index === next)) setService(service, index === next);
    });
  }

  function renderScroll() {
    scrollFrame = 0;
    if (document.hidden) return;
    const height = window.innerHeight;
    const pageRange = root.scrollHeight - height;
    const summaryPositions = services.map(service => service.querySelector('summary').getBoundingClientRect());
    const storyRect = story.getBoundingClientRect();
    header.classList.toggle('is-scrolled', window.scrollY > 15);
    if (readingProgress) readingProgress.style.transform =
      'scaleX(' + (pageRange > 0 ? clamp(window.scrollY / pageRange) : 0) + ')';
    if (geometry && storyRect.bottom > 0 && storyRect.top < height) {
      currentStoryProgress = focusedStoryProgress ??
        clamp((window.scrollY - geometry.top + geometry.headerHeight) / geometry.run);
      paintStory(currentStoryProgress);
    }
    advanceServices(summaryPositions, height);
  }
  function scheduleScroll() {
    if (!scrollFrame && !document.hidden) scrollFrame = requestAnimationFrame(renderScroll);
  }
  function settleDisclosures() {
    transitions.forEach((animation, service) => {
      animation.onfinish = null;
      animation.cancel();
      service.open = desiredOpen.get(service);
      service.style.height = '';
      service.style.overflow = '';
      service.querySelector('.service-panel').inert = false;
    });
    transitions.clear();
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', () => {
    settleDisclosures();
    // Ignore mobile browser-toolbar height changes, preserving the scroll timeline.
    if (Math.abs(window.innerWidth - lastWidth) > 2 || !mobile.matches) configureStory();
    scheduleScroll();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && scrollFrame) { cancelAnimationFrame(scrollFrame); scrollFrame = 0; }
    else scheduleScroll();
  });
  reducedMotion.addEventListener('change', () => {
    settleDisclosures();
    configureReveals();
    configureStory();
    scheduleScroll();
  });

  // Native dialog supplies focus trapping, Escape and opener focus restoration.
  const dialog = document.querySelector('.photo-dialog');
  const dialogImage = dialog.querySelector('.dialog-image');
  const dialogCaption = dialog.querySelector('.dialog-caption');
  const galleryImages = [
    ['assets/garden.webp', 'Voorbeeldfoto van een verzorgde groene tuin', 'Een groene buitenplek'],
    ['assets/garden-patio.webp', 'Voorbeeldfoto van een tuin met een gazon, terras en houten bank', 'Ruimte om buiten te zijn'],
    ['assets/border.webp', 'Voorbeeldfoto van bloeiende borders en siergrassen', 'Groen in ieder detail']
  ];
  let activePhoto = 0;
  function showPhoto(index) {
    activePhoto = (index + galleryImages.length) % galleryImages.length;
    const [src, alt, label] = galleryImages[activePhoto];
    dialogImage.src = src;
    dialogImage.alt = alt;
    dialogCaption.textContent = String(activePhoto + 1).padStart(2, '0') + ' / 03 · ' + label;
  }
  if (typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-open-photo]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => {
        showPhoto(Number(button.dataset.openPhoto));
        dialog.showModal();
      });
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.gallery-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
    dialog.querySelector('.gallery-next').addEventListener('click', () => showPhoto(activePhoto + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog &&
          (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
    let pointerStart = null;
    dialogImage.addEventListener('pointerdown', event => { pointerStart = { x: event.clientX, y: event.clientY }; });
    dialogImage.addEventListener('pointerup', event => {
      if (!pointerStart) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(activePhoto + (dx < 0 ? 1 : -1));
      pointerStart = null;
    });
    dialogImage.addEventListener('pointercancel', () => { pointerStart = null; });
  }

  // Only the composed text field leaves the page, when the visitor submits.
  // WhatsApp still requires the visitor to review and send their message.
  const form = document.querySelector('#contact-form');
  const nameInput = document.querySelector('#contact-name');
  const messageInput = document.querySelector('#contact-message');
  const serviceInput = document.querySelector('#contact-service');
  [nameInput, messageInput].forEach(input => input.addEventListener('input', () => {
    input.setCustomValidity('');
    form.querySelector('.form-status').textContent = '';
  }));
  messageInput.addEventListener('input', () => {
    form.querySelector('.character-count').textContent = messageInput.value.length + ' / 1000';
  });
  form.addEventListener('submit', event => {
    nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Vul je naam in.');
    messageInput.setCustomValidity(messageInput.value.trim() ? '' : 'Vertel kort wat je wilt aanpakken.');
    if (!form.reportValidity()) { event.preventDefault(); return; }
    document.querySelector('#whatsapp-text').value =
      'Hoi Jesse! Ik ben ' + nameInput.value.trim() + '.\n\n' +
      'Waarmee je kunt helpen: ' + serviceInput.value + '.\n\n' + messageInput.value.trim();
    form.querySelector('.form-status').textContent = 'Controleer en verstuur je bericht in WhatsApp.';
  });
  form.hidden = false;
  form.setAttribute('aria-describedby', 'form-note');

  if ('ResizeObserver' in window) new ResizeObserver(scheduleScroll).observe(document.body);
  configureReveals();
  configureStory();
  document.fonts?.ready.then(() => { configureStory(); scheduleScroll(); });
  scheduleScroll();
})();
