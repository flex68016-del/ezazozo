# Eza Zozo - Poisson Braisé

Site vitrine du restaurant "Eza Zozo - Poisson Braisé" à Lomé (Togo), spécialisé dans le tilapia braisé.

## 📁 Structure du Projet

```
Ezazozo/
├── index.html              # Page principale
├── favicon.svg             # Favicon SVG
├── robots.txt              # Robots.txt pour SEO
├── sitemap.xml             # Sitemap.xml pour SEO
├── vercel.json             # Configuration Vercel
├── css/
│   ├── tokens.css          # Design system
│   ├── base.css            # Reset et styles de base
│   ├── components.css      # Styles des composants
│   └── sections.css        # Styles des sections
├── js/
│   ├── main.js             # Point d'entrée
│   ├── config.js           # Configuration centrale
│   ├── i18n.js             # Internationalisation
│   ├── motion.js           # Animations GSAP + Lenis
│   ├── cart.js             # Gestion du panier
│   ├── menu.js             # Gestion du menu
│   ├── gallery.js          # Gestion de la galerie
│   ├── team.js             # Gestion de l'équipe
│   ├── reservation.js      # Gestion des réservations
│   └── infos.js            # Gestion des infos pratiques
├── data/
│   ├── menu.json           # Données du menu
│   ├── gallery.json        # Données de la galerie
│   ├── team.json           # Données de l'équipe
│   ├── fr.json             # Traductions françaises
│   └── en.json             # Traductions anglaises
└── assets/
    └── img/                # Images existantes
        ├── hero-1.jpg
        ├── owner.jpg
        ├── tilapia-1.jpg
        ├── tilapia-2.jpg
        ├── accompagnements-1.jpg
        ├── accompagnements-2.jpg
        ├── accompagnements-3.jpg
        ├── salle-1.jpg
        ├── salle-2.jpg
        └── salle-3.jpg
```

## 🎨 Design System

Palette "Terre & Épices" : Terracotta (#C9652B), Brun Profond (#3D2918), Ocre (#D4A535), Safran (#F4B942), Crème (#FDF6E9), Charbon (#1A1A1A), Piment (#E63946).

Typographie : Fraunces (titres), DM Sans (texte), échelle fluide avec clamp().

## 🛠 Stack Technique

HTML5, CSS3, JavaScript Vanilla (ES Modules), GSAP + ScrollTrigger, Lenis (CDN uniquement).

## 📱 Configuration

Contact : WhatsApp 22890003921, Téléphone 22890003921, Adresse : Quartier Jean-Paul II / Agoè 2 Lions (carrefour Plateaux), Lomé.

## 🔄 TODO Restants

### À Valider avec le Propriétaire

1. **Horaires d'ouverture** (js/config.js) - PROVISOIRES
2. **Frais de livraison** (js/config.js) - PROVISOIRES
3. **Prix du menu** (data/menu.json) - PROVISOIRES
4. **Textes de l'équipe** (data/team.json) - PROVISOIRES
5. **Textes "Notre Histoire"** (index.html) - "À VALIDER PAR LE PROPRIÉTAIRE"
6. **Textes "Plat Signature"** (index.html) - "À VALIDER PAR LE PROPRIÉTAIRE"

### À Compléter

7. **Photos de l'équipe** (data/team.json) - images null (placeholder avec initiales)
8. **Réseaux sociaux** (index.html footer) - Facebook, Instagram, TikTok (href="#")

### Optimisations Images (Recommandé)

9. **Conversion en WebP** - Convertir toutes les images JPG en WebP pour un meilleur chargement

## ✨ Fonctionnalités

- ✅ Hero avec parallax et animations
- ✅ Histoire avec masque et texte progressif
- ✅ Plat Signature avec scroll pinned
- ✅ Menu dynamique avec panier
- ✅ Galerie avec lightbox accessible
- ✅ Équipe avec placeholders élégants
- ✅ Réservation avec WhatsApp
- ✅ Infos pratiques avec carte et statut ouvert/fermé
- ✅ Internationalisation FR/EN complète
- ✅ SEO (meta tags, Open Graph, Twitter Card, JSON-LD, robots.txt, sitemap.xml)
- ✅ Performance (preload, lazy loading, scripts différés, cache headers)
- ✅ Accessibilité (contrastes, focus, ARIA, reduced-motion)

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
git init
git add .
git commit -m "Initial commit"
npx vercel
```

## 📊 Données JSON

Toutes les données sont externalisées dans `data/` (menu, gallery, team, fr, en).

---

*Site créé par Dev Amankwaah - https://amankwaah-prince.site/*
