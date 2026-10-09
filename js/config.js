/* ============================================
   CONFIGURATION CENTRALE - EZA ZOZO
   ============================================ */

export const config = {
  // Contact
  whatsapp: '22890003921',
  phone: '22890003921',
  address: 'Quartier Jean-Paul II / Agoè 2 Lions (carrefour Plateaux), Lomé',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Eza+Zozo+Poisson+Braisé+Lomé',

  // Horaires PROVISOIRES - TODO
  hours: {
    monday: { open: '11:00', close: '22:00' },
    tuesday: { open: '11:00', close: '22:00' },
    wednesday: { open: '11:00', close: '22:00' },
    thursday: { open: '11:00', close: '22:00' },
    friday: { open: '11:00', close: '23:00' },
    saturday: { open: '11:00', close: '23:00' },
    sunday: { open: '12:00', close: '21:00' },
  },

  // Frais de livraison PROVISOIRES - TODO
  delivery: {
    baseFee: 1000,
    freeDeliveryThreshold: 15000,
    zones: [
      { name: 'Agoè', fee: 1000 },
      { name: 'Lomé Centre', fee: 1500 },
      { name: 'Bè', fee: 2000 },
    ],
    coverage: 'Livraison dans tout Lomé',
  },

  // Liens WhatsApp
  whatsappBaseUrl: 'https://wa.me/22890003921',

  // Configuration de l'application
  currency: 'FCFA',
  locale: 'fr',
  defaultLang: 'fr',
  supportedLangs: ['fr', 'en'],
  timezone: 'UTC',

  // Animation
  scrollSmooth: true,
  animationDuration: 0.6,
};

// Fonction utilitaire pour générer un lien WhatsApp
export function getWhatsAppLink(message = '') {
  const encodedMessage = encodeURIComponent(message);
  return `${config.whatsappBaseUrl}?text=${encodedMessage}`;
}

// Fonction utilitaire pour formater les prix
export function formatPrice(price) {
  return `${price.toLocaleString()} ${config.currency}`;
}

// Fonction pour vérifier si le restaurant est ouvert
export function isOpenNow() {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const hours = config.hours[currentDay];

  if (!hours) return false;

  const [openHour, openMinute] = hours.open.split(':').map(Number);
  const [closeHour, closeMinute] = hours.close.split(':').map(Number);

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;

  return currentTime >= openTime && currentTime < closeTime;
}
