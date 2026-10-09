/* ============================================
   RESERVATION - Gestion des réservations
   ============================================ */

import { getWhatsAppLink } from './config.js';
import gsap from 'gsap';

export function initReservation() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  // Set minimum date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Focus animations
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input, {
        borderColor: 'var(--color-terracotta)',
        boxShadow: '0 0 0 3px var(--color-terracotta-20)',
        duration: 0.3
      });
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        gsap.to(input, {
          borderColor: 'var(--border-secondary)',
          boxShadow: 'none',
          duration: 0.3
        });
      }
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleReservationSubmit(form);
  });
}

function handleReservationSubmit(form) {
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    date: formData.get('date'),
    time: formData.get('time'),
    guests: formData.get('guests'),
    message: formData.get('message')
  };

  // Format date for display
  const dateObj = new Date(data.date);
  const formattedDate = dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let message = `📅 *Demande de réservation - Eza Zozo*\n\n`;
  message += `👤 *Nom:* ${data.name}\n`;
  message += `📱 *Téléphone:* ${data.phone}\n`;
  message += `📆 *Date:* ${formattedDate}\n`;
  message += `⏰ *Heure:* ${data.time}\n`;
  message += `👥 *Personnes:* ${data.guests}\n`;
  if (data.message) {
    message += `📝 *Message:* ${data.message}\n`;
  }
  message += `\nMerci pour votre demande de réservation ! Nous vous confirmerons rapidement. 🙏`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/22890003921?text=${encodedMessage}`;

  // Show success message
  showSuccessMessage(form);

  // Open WhatsApp after a short delay
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 1500);
}

function showSuccessMessage(form) {
  const successDiv = document.getElementById('reservationSuccess');
  const formContainer = form.parentElement;

  // Hide form with animation
  gsap.to(form, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      form.style.display = 'none';
      successDiv.style.display = 'block';

      // Show success message with animation
      gsap.fromTo(successDiv,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      gsap.fromTo(successDiv.querySelector('.success-icon'),
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' }
      );
    }
  });
}
