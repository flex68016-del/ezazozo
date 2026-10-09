/* ============================================
   CART - Gestion du panier
   ============================================ */

import { formatPrice, getWhatsAppLink } from './config.js';
import gsap from 'gsap';

let cart = [];
let cartDrawer = null;
let cartOverlay = null;

export function initCart() {
  // Charger le panier depuis localStorage
  loadCart();

  // Créer le tiroir du panier
  createCartDrawer();

  // Écouteur sur le bouton panier du header
  const cartButton = document.querySelector('.cart-button');
  if (cartButton) {
    cartButton.addEventListener('click', openCart);
  }
}

function loadCart() {
  const savedCart = localStorage.getItem('eza-zozo-cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartBadge();
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      cart = [];
    }
  }
}

function saveCart() {
  localStorage.setItem('eza-zozo-cart', JSON.stringify(cart));
  updateCartBadge();
}

function createCartDrawer() {
  // Créer l'overlay
  cartOverlay = document.createElement('div');
  cartOverlay.className = 'cart-overlay';
  cartOverlay.setAttribute('aria-hidden', 'true');
  cartOverlay.addEventListener('click', closeCart);

  // Créer le tiroir
  cartDrawer = document.createElement('aside');
  cartDrawer.className = 'cart-drawer';
  cartDrawer.setAttribute('role', 'dialog');
  cartDrawer.setAttribute('aria-label', 'Panier');
  cartDrawer.setAttribute('aria-hidden', 'true');

  cartDrawer.innerHTML = `
    <div class="cart-header">
      <h2 data-i18n="cart.title">Mon Panier</h2>
      <button class="cart-close" aria-label="Fermer le panier">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="cart-items">
      <!-- Les items seront injectés ici -->
    </div>
    <div class="cart-footer">
      <div class="cart-total">
        <span data-i18n="cart.total">Total</span>
        <span class="cart-total-amount">0 FCFA</span>
      </div>
      <button class="cart-checkout" data-i18n="cart.checkout">Commander sur WhatsApp</button>
    </div>
  `;

  // Ajouter au DOM
  document.body.appendChild(cartOverlay);
  document.body.appendChild(cartDrawer);

  // Écouteurs d'événements
  cartDrawer.querySelector('.cart-close').addEventListener('click', closeCart);
  cartDrawer.querySelector('.cart-checkout').addEventListener('click', openCheckoutForm);

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cartDrawer.getAttribute('aria-hidden') === 'false') {
      closeCart();
    }
  });
}

export function addToCart(item) {
  const existingItem = cart.find(i => i.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  openCart();

  // Petit feedback visuel
  const cartButton = document.querySelector('.cart-button');
  if (cartButton) {
    gsap.fromTo(cartButton,
      { scale: 1.2 },
      { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' }
    );
  }
}

export function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  renderCart();
}

export function updateQuantity(itemId, delta) {
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      saveCart();
      renderCart();
    }
  }
}

function renderCart() {
  const cartItemsContainer = cartDrawer.querySelector('.cart-items');
  const cartTotalAmount = cartDrawer.querySelector('.cart-total-amount');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <p>Votre panier est vide</p>
      </div>
    `;
    cartTotalAmount.textContent = formatPrice(0);
    cartDrawer.querySelector('.cart-checkout').disabled = true;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn minus" data-item-id="${item.id}" aria-label="Diminuer la quantité">-</button>
        <span class="quantity-value">${item.quantity}</span>
        <button class="quantity-btn plus" data-item-id="${item.id}" aria-label="Augmenter la quantité">+</button>
      </div>
      <div class="cart-item-total">
        ${formatPrice(item.price * item.quantity)}
      </div>
      <button class="cart-item-remove" data-item-id="${item.id}" aria-label="Supprimer ${item.name}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `).join('');

  // Calculer le total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalAmount.textContent = formatPrice(total);
  cartDrawer.querySelector('.cart-checkout').disabled = false;

  // Ajouter les écouteurs pour les boutons de quantité
  cartItemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = button.getAttribute('data-item-id');
      const delta = button.classList.contains('plus') ? 1 : -1;
      updateQuantity(itemId, delta);
    });
  });

  // Ajouter les écouteurs pour les boutons de suppression
  cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = button.getAttribute('data-item-id');
      removeFromCart(itemId);
    });
  });
}

function updateCartBadge() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function openCart() {
  renderCart();
  cartOverlay.style.display = 'block';
  cartDrawer.setAttribute('aria-hidden', 'false');

  // Animation d'ouverture
  gsap.fromTo(cartOverlay,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );

  gsap.fromTo(cartDrawer,
    { x: '100%' },
    { x: '0%', duration: 0.4, ease: 'power3.out' }
  );

  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.setAttribute('aria-hidden', 'true');

  // Animation de fermeture
  gsap.to(cartOverlay, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      cartOverlay.style.display = 'none';
    }
  });

  gsap.to(cartDrawer, {
    x: '100%',
    duration: 0.4,
    ease: 'power3.in'
  });

  document.body.style.overflow = '';
}

function openCheckoutForm() {
  if (cart.length === 0) return;

  // Créer le modal de checkout
  const checkoutModal = document.createElement('div');
  checkoutModal.className = 'checkout-modal';
  checkoutModal.setAttribute('role', 'dialog');
  checkoutModal.setAttribute('aria-label', 'Formulaire de commande');

  checkoutModal.innerHTML = `
    <div class="checkout-overlay"></div>
    <div class="checkout-content">
      <div class="checkout-header">
        <h2>Finaliser la commande</h2>
        <button class="checkout-close" aria-label="Fermer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <form class="checkout-form">
        <div class="form-group">
          <label for="checkout-name">Votre nom</label>
          <input type="text" id="checkout-name" name="name" required>
        </div>
        <div class="form-group">
          <label for="checkout-quarter">Quartier de livraison</label>
          <input type="text" id="checkout-quarter" name="quarter" required>
        </div>
        <div class="form-group">
          <label for="checkout-details">Précisions (optionnel)</label>
          <textarea id="checkout-details" name="details" rows="3"></textarea>
        </div>
        <button type="submit" class="checkout-submit">Commander sur WhatsApp</button>
      </form>
    </div>
  `;

  document.body.appendChild(checkoutModal);

  // Écouteurs
  checkoutModal.querySelector('.checkout-close').addEventListener('click', () => {
    document.body.removeChild(checkoutModal);
  });

  checkoutModal.querySelector('.checkout-overlay').addEventListener('click', () => {
    document.body.removeChild(checkoutModal);
  });

  checkoutModal.querySelector('.checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = {
      name: formData.get('name'),
      quarter: formData.get('quarter'),
      details: formData.get('details')
    };
    document.body.removeChild(checkoutModal);
    sendWhatsAppOrder(orderData);
  });

  // Animation d'ouverture
  gsap.fromTo(checkoutModal.querySelector('.checkout-overlay'),
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );

  gsap.fromTo(checkoutModal.querySelector('.checkout-content'),
    { opacity: 0, y: 20, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
  );
}

function sendWhatsAppOrder(orderData) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let message = `🐟 *Nouvelle commande - Eza Zozo*\n\n`;
  message += `👤 *Nom:* ${orderData.name}\n`;
  message += `📍 *Quartier:* ${orderData.quarter}\n`;
  if (orderData.details) {
    message += `📝 *Précisions:* ${orderData.details}\n`;
  }
  message += `\n📋 *Commande:*\n`;
  cart.forEach(item => {
    message += `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
  });
  message += `\n💰 *Total:* ${formatPrice(total)}\n\n`;
  message += `Merci pour votre commande ! 🙏`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/22890003921?text=${encodedMessage}`;

  // Vider le panier après la commande
  cart = [];
  saveCart();
  renderCart();
  closeCart();

  // Ouvrir WhatsApp
  window.open(whatsappUrl, '_blank');
}

