/* ============================================
   MAIN SCRIPT - Point d'entrée
   ============================================ */

import { config } from './config.js';
import { initMotion } from './motion.js';
import { initCart } from './cart.js';
import { initMenu } from './menu.js';
import { initGallery } from './gallery.js';
import { initTeam } from './team.js';
import { initReservation } from './reservation.js';
import { initInfos } from './infos.js';

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
  console.log('Eza Zozo - Initialisation');

  // Initialiser les animations
  initMotion();

  // Initialiser le panier
  initCart();

  // Initialiser le menu
  initMenu();

  // Initialiser la galerie
  initGallery();

  // Initialiser l'équipe
  initTeam();

  // Initialiser les réservations
  initReservation();

  // Initialiser les infos pratiques
  initInfos();
});
