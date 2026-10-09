/* ============================================
   MENU - Gestion du menu
   ============================================ */

import { formatPrice } from './config.js';
import { addToCart } from './cart.js';
import gsap from 'gsap';

let menuData = null;
let activeCategory = null;

export async function initMenu() {
  try {
    const response = await fetch('/data/menu.json');
    menuData = await response.json();

    if (menuData && menuData.categories.length > 0) {
      activeCategory = menuData.categories[0].id;
      renderMenu();
      setupCategoryTabs();
    }
  } catch (error) {
    console.error('Erreur lors du chargement du menu:', error);
  }
}

function renderMenu() {
  const menuSection = document.querySelector('.menu-content');
  if (!menuSection || !menuData) return;

  // Créer les onglets de catégories
  const tabsHTML = `
    <div class="menu-tabs">
      ${menuData.categories.map(cat => `
        <button
          class="menu-tab ${cat.id === activeCategory ? 'active' : ''}"
          data-category="${cat.id}"
          aria-label="${cat.name}"
          aria-selected="${cat.id === activeCategory}"
        >
          ${cat.name}
        </button>
      `).join('')}
    </div>
  `;

  // Créer le contenu des items
  const itemsHTML = `
    <div class="menu-items">
      ${menuData.categories.map(cat => `
        <div class="menu-category-content" data-category="${cat.id}" style="display: ${cat.id === activeCategory ? 'grid' : 'none'}">
          ${cat.items.map(item => `
            <article class="menu-item">
              ${item.image ? `
                <div class="menu-item-image">
                  <img src="assets/img/${item.image}" alt="${item.name}" loading="lazy">
                </div>
              ` : ''}
              <div class="menu-item-content">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                  <button
                    class="menu-item-add"
                    data-item-id="${item.id}"
                    aria-label="Ajouter ${item.name} au panier"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span data-i18n="menu.addToCart">Ajouter</span>
                  </button>
                </div>
                ${item.todo ? `<span class="menu-item-todo">Prix provisoire</span>` : ''}
              </div>
            </article>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;

  menuSection.innerHTML = tabsHTML + itemsHTML;

  // Ajouter les écouteurs d'événements pour les boutons "Ajouter"
  document.querySelectorAll('.menu-item-add').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = button.getAttribute('data-item-id');
      const item = findItemById(itemId);
      if (item) {
        addToCart(item);
      }
    });
  });
}

function setupCategoryTabs() {
  const tabs = document.querySelectorAll('.menu-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const categoryId = tab.getAttribute('data-category');

      // Mettre à jour l'onglet actif
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Mettre à jour le contenu actif avec animation
      const contents = document.querySelectorAll('.menu-category-content');
      contents.forEach(content => {
        if (content.getAttribute('data-category') === categoryId) {
          content.style.display = 'grid';
          // Animation d'apparition
          gsap.fromTo(content.querySelectorAll('.menu-item'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
          );
        } else {
          content.style.display = 'none';
        }
      });

      activeCategory = categoryId;
    });
  });
}

function findItemById(itemId) {
  if (!menuData) return null;

  for (const category of menuData.categories) {
    const item = category.items.find(i => i.id === itemId);
    if (item) return item;
  }

  return null;
}

export function refreshMenu() {
  if (menuData) {
    renderMenu();
    setupCategoryTabs();
  }
}

// Exposer la fonction globalement pour i18n
window.refreshMenu = refreshMenu;

