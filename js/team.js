/* ============================================
   TEAM - Gestion de l'équipe
   ============================================ */

import gsap from 'gsap';

let teamData = null;

export async function initTeam() {
  try {
    const response = await fetch('/data/team.json');
    teamData = await response.json();

    if (teamData && teamData.members.length > 0) {
      renderTeam();
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'équipe:', error);
  }
}

function renderTeam() {
  const teamContent = document.querySelector('.team-content');
  if (!teamContent || !teamData) return;

  teamContent.innerHTML = `
    <div class="team-grid">
      ${teamData.members.map(member => `
        <article class="team-member">
          <div class="member-photo ${member.image ? '' : 'member-photo-placeholder'}">
            ${member.image ? `
              <img
                src="assets/img/${member.image}"
                alt="${member.name}"
                loading="lazy"
                class="member-image"
              >
            ` : `
              <div class="member-placeholder" role="img" aria-label="${member.name} - Photo à venir">
                <span class="member-initials">${getInitials(member.name)}</span>
                <span class="member-placeholder-text">Photo à venir</span>
              </div>
            `}
          </div>
          <div class="member-info">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>
            <p class="member-bio">${member.bio}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;

  // Stagger animation on scroll
  gsap.fromTo('.team-member',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.team-grid',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // Image reveal animation for members with photos
  document.querySelectorAll('.member-image').forEach(img => {
    gsap.fromTo(img,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: img,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

function getInitials(name) {
  const words = name.split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
}

export function refreshTeam() {
  if (teamData) {
    renderTeam();
  }
}

// Exposer la fonction globalement pour i18n
window.refreshTeam = refreshTeam;
