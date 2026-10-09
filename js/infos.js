/* ============================================
   INFOS - Gestion de la section Infos Pratiques
   ============================================ */

import { config, formatPrice, isOpenNow } from './config.js';

export function initInfos() {
  renderHours();
  renderDeliveryInfo();
  lazyLoadMap();
}

function renderHours() {
  const hoursContent = document.getElementById('hoursContent');
  const openStatus = document.getElementById('openStatus');

  if (!hoursContent || !openStatus) return;

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const hoursHtml = Object.entries(config.hours).map(([day, times]) => {
    const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day);
    const dayName = dayNames[dayIndex];

    return `
      <div class="hours-row">
        <span class="hours-day">${dayName}</span>
        <span class="hours-time">${times.open} - ${times.close}</span>
      </div>
    `;
  }).join('');

  hoursContent.innerHTML = hoursHtml;

  // Statut ouvert/fermé
  const isOpen = isOpenNow();
  const statusClass = isOpen ? 'open' : 'closed';
  const statusText = isOpen ? 'Ouvert maintenant' : 'Fermé maintenant';

  openStatus.innerHTML = `
    <span class="status-indicator ${statusClass}"></span>
    <span class="status-text">${statusText}</span>
  `;

  // Mettre à jour toutes les minutes
  setInterval(renderHours, 60000);
}

function renderDeliveryInfo() {
  const deliveryFee = document.getElementById('deliveryFee');

  if (!deliveryFee) return;

  let feeText = '';

  if (config.delivery.freeDeliveryThreshold) {
    feeText = `Livraison gratuite à partir de ${formatPrice(config.delivery.freeDeliveryThreshold)}`;
  } else if (config.delivery.baseFee) {
    feeText = `Livraison à partir de ${formatPrice(config.delivery.baseFee)}`;
  }

  if (config.delivery.zones && config.delivery.zones.length > 0) {
    const minFee = Math.min(...config.delivery.zones.map(z => z.fee));
    const maxFee = Math.max(...config.delivery.zones.map(z => z.fee));

    if (minFee === maxFee) {
      feeText = `${formatPrice(minFee)}`;
    } else {
      feeText = `${formatPrice(minFee)} - ${formatPrice(maxFee)}`;
    }
  }

  deliveryFee.textContent = feeText;
}

function lazyLoadMap() {
  const mapIframe = document.getElementById('mapIframe');

  if (!mapIframe) return;

  // Observer pour charger la carte quand visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Embed Google Maps avec l'adresse
        const address = encodeURIComponent(config.address);
        mapIframe.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${address}`;

        // Fallback avec une recherche Google Maps si pas d'API key
        mapIframe.src = `https://maps.google.com/maps?q=${address}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

        observer.unobserve(mapIframe);
      }
    });
  }, {
    rootMargin: '200px'
  });

  observer.observe(mapIframe);
}
