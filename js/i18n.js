/* ============================================
   I18N - Internationalisation
   ============================================ */

let currentLang = 'fr';
let translations = {};

// Fonction pour détecter la langue du navigateur
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0]; // 'fr' from 'fr-FR', 'en' from 'en-US'

  if (['fr', 'en'].includes(langCode)) {
    return langCode;
  }

  return 'fr'; // Langue par défaut
}

export async function initI18n() {
  // 1. Vérifier localStorage
  const savedLang = localStorage.getItem('eza-zozo-lang');

  // 2. Si pas de préférence sauvegardée, détecter la langue du navigateur
  if (savedLang && ['fr', 'en'].includes(savedLang)) {
    currentLang = savedLang;
  } else {
    currentLang = detectBrowserLanguage();
    localStorage.setItem('eza-zozo-lang', currentLang);
  }

  await loadTranslations(currentLang);
  applyTranslations();
  setupLanguageSwitcher();
  setupMobileMenu();
}

async function loadTranslations(lang) {
  try {
    const response = await fetch(`/data/${lang}.json`);
    translations = await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement des traductions:', error);
  }
}

function applyTranslations() {
  // Mettre à jour tous les éléments avec data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[key]) {
      element.textContent = translations[key];
    }
  });

  // Mettre à jour les attributs data-i18n-attr (pour placeholder, aria-label, etc.)
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    const attrMap = JSON.parse(element.getAttribute('data-i18n-attr'));
    Object.keys(attrMap).forEach(attr => {
      const key = attrMap[attr];
      if (translations[key]) {
        element.setAttribute(attr, translations[key]);
      }
    });
  });

  // Mettre à jour l'état des boutons de langue
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    btn.setAttribute('aria-pressed', lang === currentLang);
  });

  // Mettre à jour l'attribut lang du document
  document.documentElement.lang = currentLang;

  // Mettre à jour le titre de la page
  if (translations['meta.title']) {
    document.title = translations['meta.title'];
  }

  // Recharger les sections dynamiques
  refreshDynamicSections();
}

function refreshDynamicSections() {
  // Recharger le menu
  if (window.refreshMenu) {
    window.refreshMenu();
  }

  // Recharger la galerie
  if (window.refreshGallery) {
    window.refreshGallery();
  }

  // Recharger l'équipe
  if (window.refreshTeam) {
    window.refreshTeam();
  }
}

function setupLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-switch button');

  langButtons.forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
}

function setupMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);

    // Empêcher le scroll quand le menu est ouvert
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Fermer le menu quand on clique sur un lien
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Fermer le menu avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuToggle.focus();
    }
  });
}

export function setLanguage(lang) {
  if (['fr', 'en'].includes(lang)) {
    currentLang = lang;
    localStorage.setItem('eza-zozo-lang', lang);

    // Transition douce
    document.body.classList.add('lang-changing');

    loadTranslations(lang).then(() => {
      applyTranslations();
      document.body.classList.remove('lang-changing');
    });
  }
}

export function t(key) {
  return translations[key] || key;
}

export function getCurrentLang() {
  return currentLang;
}


