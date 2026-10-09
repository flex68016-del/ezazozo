/* ============================================
   GALLERY - Gestion de la galerie
   ============================================ */

import gsap from 'gsap';

let galleryData = null;
let currentImageIndex = 0;
let lightbox = null;
let touchStartX = 0;
let touchEndX = 0;

export async function initGallery() {
  try {
    const response = await fetch('/data/gallery.json');
    galleryData = await response.json();

    if (galleryData && galleryData.images.length > 0) {
      renderGallery();
      initLightbox();
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la galerie:', error);
  }
}

function renderGallery() {
  const galleryContent = document.querySelector('.gallery-content');
  if (!galleryContent || !galleryData) return;

  galleryContent.innerHTML = `
    <div class="gallery-grid">
      ${galleryData.images.map((image, index) => `
        <button
          class="gallery-item"
          data-index="${index}"
          aria-label="${image.alt}"
          style="--aspect-ratio: ${image.width} / ${image.height}"
        >
          <img
            src="assets/img/${image.src}"
            srcset="assets/img/${image.src} 400w, assets/img/${image.src} 800w, assets/img/${image.src} 1200w"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="${image.alt}"
            loading="lazy"
            width="${image.width}"
            height="${image.height}"
          >
          <div class="gallery-overlay">
            <span class="gallery-caption">${image.caption}</span>
          </div>
        </button>
      `).join('')}
    </div>
  `;

  // Add click listeners
  galleryContent.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'));
      openLightbox(index);
    });
  });

  // Stagger animation on scroll
  gsap.fromTo('.gallery-item',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.gallery-grid',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

function initLightbox() {
  lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          showPrevImage();
          break;
        case 'ArrowRight':
          showNextImage();
          break;
      }
    }
  });

  // Touch swipe for mobile
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  // Close on overlay click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

function openLightbox(index) {
  currentImageIndex = index;
  updateLightboxContent();

  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.style.display = 'flex';

  // Animation
  gsap.fromTo(lightbox,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );

  gsap.fromTo('.lightbox-image-container',
    { scale: 0.9, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
  );

  // Trap focus
  trapFocus(lightbox);

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.setAttribute('aria-hidden', 'true');

  gsap.to(lightbox, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}

function updateLightboxContent() {
  const image = galleryData.images[currentImageIndex];

  const img = lightbox.querySelector('.lightbox-image');
  const caption = lightbox.querySelector('.lightbox-caption');

  img.src = `assets/img/${image.src}`;
  img.alt = image.alt;
  caption.textContent = image.caption;

  // Update button states
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  prevBtn.disabled = currentImageIndex === 0;
  nextBtn.disabled = currentImageIndex === galleryData.images.length - 1;

  prevBtn.style.opacity = currentImageIndex === 0 ? '0.3' : '1';
  nextBtn.style.opacity = currentImageIndex === galleryData.images.length - 1 ? '0.3' : '1';
}

function showNextImage() {
  if (currentImageIndex < galleryData.images.length - 1) {
    currentImageIndex++;
    updateLightboxContent();
  }
}

function showPrevImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    updateLightboxContent();
  }
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      showNextImage();
    } else {
      showPrevImage();
    }
  }
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });

  // Focus on first element
  firstFocusable.focus();
}

export function refreshGallery() {
  if (galleryData) {
    renderGallery();
  }
}

// Exposer la fonction globalement pour i18n
window.refreshGallery = refreshGallery;
