/* ============================================
   MOTION - Animations GSAP + ScrollTrigger
   ============================================ */

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis;
let customCursor;
let header;

// Détection des préférences utilisateur
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 1024;

export function initMotion() {
  if (prefersReducedMotion) {
    // Désactiver les animations si l'utilisateur préfère
    document.body.classList.add('reduced-motion');
    return;
  }

  // Initialiser Lenis pour le smooth scroll
  initLenis();

  // Initialiser l'écran de chargement
  initLoadingScreen();

  // Initialiser le header intelligent
  initSmartHeader();

  // Initialiser les animations de scroll
  initScrollAnimations();

  // Initialiser les animations spécifiques aux sections
  initHeroAnimations();
  initHistoireAnimations();
  initPlatSignatureAnimations();
  initMagneticButtons();
}

// ============================================
// LENIS - Smooth Scroll
// ============================================

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Synchroniser Lenis avec ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

export function scrollTo(target) {
  if (lenis) {
    lenis.scrollTo(target);
  } else {
    window.scrollTo({
      top: document.querySelector(target).offsetTop,
      behavior: 'smooth'
    });
  }
}

// ============================================
// LOADING SCREEN - Animation du logotype
// ============================================

function initLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (!loadingScreen) return;

  const logoIcon = loadingScreen.querySelector('.logo-icon');
  const logoDetail = loadingScreen.querySelector('.logo-detail');
  const logoEye = loadingScreen.querySelector('.logo-eye');
  const logoText = loadingScreen.querySelector('.logo-text');

  const tl = gsap.timeline({
    onComplete: () => {
      loadingScreen.style.display = 'none';
      document.body.classList.add('loaded');
    }
  });

  // Animation du logotype sans drawSVG (plugin non inclus)
  tl.fromTo(logoIcon,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
  )
  .fromTo(logoDetail,
    { opacity: 0, strokeWidth: 0 },
    { opacity: 1, strokeWidth: 2, duration: 0.4, ease: 'power2.out' }, '-=0.4'
  )
  .fromTo(logoEye,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }, '-=0.2'
  )
  .fromTo(logoText,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2'
  )
  .to(loadingScreen, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut'
  });
}

// ============================================
// SMART HEADER - Masquer/Révéler au scroll
// ============================================

function initSmartHeader() {
  header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;
  let scrollThreshold = 100;

  lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    const currentScroll = scroll;

    // Masquer en descendant, révéler en remontant
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    lastScroll = currentScroll;
  });
}

// ============================================
// CUSTOM CURSOR - Desktop uniquement
// ============================================

function initCustomCursor() {
  customCursor = document.querySelector('.custom-cursor');
  if (!customCursor) return;

  const cursorDot = customCursor.querySelector('.cursor-dot');
  const cursorRing = customCursor.querySelector('.cursor-ring');

  // Cacher le curseur par défaut sur desktop
  document.body.style.cursor = 'none';

  // Suivre la souris
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Le point suit instantanément
    gsap.set(cursorDot, { x: mouseX, y: mouseY });
  });

  // L'anneau suit avec un délai
  gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
    cursorX += (mouseX - cursorX) * dt;
    cursorY += (mouseY - cursorY) * dt;
    gsap.set(cursorRing, { x: cursorX, y: cursorY });
  });

  // Effets hover sur les éléments interactifs
  const interactiveElements = document.querySelectorAll('a, button, [role="button"]');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursorRing, { scale: 1.5, duration: 0.3 });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(cursorRing, { scale: 1, duration: 0.3 });
    });
  });

  // Cacher le curseur quand la souris quitte la fenêtre
  document.addEventListener('mouseleave', () => {
    gsap.to(customCursor, { opacity: 0, duration: 0.3 });
  });

  document.addEventListener('mouseenter', () => {
    gsap.to(customCursor, { opacity: 1, duration: 0.3 });
  });
}

// ============================================
// SCROLL ANIMATIONS - Utilitaires réutilisables
// ============================================

function initScrollAnimations() {
  // Texte révélé ligne par ligne
  document.querySelectorAll('.reveal-text').forEach(el => {
    revealTextLines(el);
  });

  // Images révélées par masque
  document.querySelectorAll('.reveal-image').forEach(el => {
    revealImageMask(el);
  });
}

// ============================================
// UTILITAIRES D'ANIMATION
// ============================================

/**
 * Révéler le texte mot par mot avec espaces préservés
 * @param {HTMLElement} element - Élément contenant le texte
 */
export function revealTextLines(element) {
  if (prefersReducedMotion) return;

  const text = element.textContent;
  // Sauvegarder le texte original pour l'accessibilité
  const originalText = text;

  // Diviser en mots en préservant la ponctuation
  const words = text.split(/\s+/).filter(word => word.length > 0);

  element.innerHTML = '';
  element.setAttribute('aria-label', originalText);

  words.forEach((word, index) => {
    // Créer le masque du mot
    const wordMask = document.createElement('span');
    wordMask.className = 'word-mask';
    wordMask.setAttribute('aria-hidden', 'true');

    // Créer le span du mot animé
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    wordSpan.textContent = word;
    wordSpan.style.opacity = '0';
    wordSpan.style.display = 'inline-block';

    wordMask.appendChild(wordSpan);
    element.appendChild(wordMask);

    // Ajouter un espace après chaque mot sauf le dernier
    if (index < words.length - 1) {
      const space = document.createTextNode(' ');
      element.appendChild(space);
    }
  });

  const wordSpans = element.querySelectorAll('.word');

  gsap.fromTo(wordSpans,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

/**
 * Révéler une image avec un masque
 * @param {HTMLElement} element - Élément image ou conteneur d'image
 */
export function revealImageMask(element) {
  if (prefersReducedMotion) return;

  gsap.fromTo(element,
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

/**
 * Animation fade-in générique
 * @param {HTMLElement} element - Élément à animer
 * @param {Object} options - Options GSAP personnalisables
 */
export function fadeIn(element, options = {}) {
  if (prefersReducedMotion) return;

  const defaults = {
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  };

  gsap.fromTo(element, { opacity: 0, y: 50 }, { ...defaults, ...options });
}

/**
 * Animation stagger pour une liste d'éléments
 * @param {NodeList} elements - Liste d'éléments à animer
 * @param {Object} options - Options GSAP personnalisables
 */
export function staggerFadeIn(elements, options = {}) {
  if (prefersReducedMotion) return;

  const defaults = {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: elements[0],
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  };

  gsap.fromTo(elements, { opacity: 0, y: 30 }, { ...defaults, ...options });
}

/**
 * Parallax horizontal pour une image
 * @param {HTMLElement} element - Élément image
 * @param {number} speed - Vitesse du parallax (ex: 0.5)
 */
export function parallaxX(element, speed = 0.5) {
  if (prefersReducedMotion) return;

  gsap.to(element, {
    x: () => (element.offsetWidth * speed),
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

/**
 * Parallax vertical pour une image
 * @param {HTMLElement} element - Élément image
 * @param {number} speed - Vitesse du parallax (ex: 0.3)
 */
export function parallaxY(element, speed = 0.3) {
  if (prefersReducedMotion) return;

  gsap.to(element, {
    y: () => (element.offsetHeight * speed),
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

// ============================================
// SECTION-SPECIFIC ANIMATIONS
// ============================================

/**
 * Animations de la section Hero
 */
function initHeroAnimations() {
  const heroImage = document.querySelector('.hero-image');
  const heroTitle = document.querySelector('.hero-title');

  if (heroImage) {
    // Parallax lent sur l'image de fond
    parallaxY(heroImage, 0.3);
  }

  if (heroTitle) {
    // Titre révélé ligne par ligne
    revealTextLines(heroTitle);
  }
}

/**
 * Animations de la section Histoire
 */
function initHistoireAnimations() {
  const histoireImage = document.querySelector('.histoire-image');
  const histoireTexts = document.querySelectorAll('.histoire-column p');

  if (histoireImage) {
    // Image révélée par masque
    revealImageMask(histoireImage);
  }

  if (histoireTexts.length > 0) {
    // Texte révélé mot par mot avec espaces préservés
    histoireTexts.forEach((text) => {
      revealTextLines(text);
    });
  }
}

/**
 * Animations de la section Plat Signature (pinned scroll)
 */
function initPlatSignatureAnimations() {
  const images = document.querySelectorAll('.signature-image');
  const steps = document.querySelectorAll('.signature-step');

  if (images.length === 0 || steps.length === 0) return;

  // Créer un ScrollTrigger pinned
  ScrollTrigger.create({
    trigger: '.plat-signature-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.plat-signature-images',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalSteps = steps.length;
      const currentStep = Math.floor(progress * totalSteps);

      // Activer l'image correspondante
      images.forEach((img, index) => {
        if (index === currentStep) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });

      // Activer l'étape correspondante
      steps.forEach((step, index) => {
        if (index === currentStep) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }
  });
}

/**
 * Effet magnétique sur les boutons
 */
function initMagneticButtons() {
  if (prefersReducedMotion || isMobile) return;

  const magneticButtons = document.querySelectorAll('.magnetic-button');

  magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
}

