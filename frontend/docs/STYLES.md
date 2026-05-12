# Documentation des Styles - ArtisanArt

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Système de design](#système-de-design)
3. [Variables CSS](#variables-css)
4. [Typographie](#typographie)
5. [Composants réutilisables](#composants-réutilisables)
6. [Layouts](#layouts)
7. [Animations](#animations)
8. [Responsive design](#responsive-design)
9. [Bonnes pratiques](#bonnes-pratiques)

---

## Vue d'ensemble

ArtisanArt utilise une approche de styling modulaire avec :
- **CSS personnalisé** avec variables CSS (Custom Properties)
- **Styles globaux** dans `styles.css`
- **Styles composants** isolés (encapsulation Angular)
- **Système de design cohérent** avec palette de couleurs définie

### Architecture des styles

```
src/
├── styles.css                 # Styles globaux
├── app/
│   ├── shared/
│   │   └── components/
│   │       ├── header/
│   │       │   └── header.css # Styles du header
│   │       └── footer/
│   │           └── footer.css # Styles du footer
│   └── features/
│       └── [feature]/
│           └── [component].css # Styles du composant
```

---

## Système de design

### Palette de couleurs

ArtisanArt utilise une palette terracotta/beige chaleureuse :

```css
:root {
  /* Palette principale (du plus foncé au plus clair) */
  --color-palette1: #9a2b1b;  /* Rouge foncé */
  --color-palette2: #a54335;
  --color-palette3: #b15b4e;
  --color-palette4: #bc7667;
  --color-palette5: #c78a81;
  --color-palette6: #d2a19a;
  --color-palette7: #ddb9b3;
  --color-palette8: #e9d0cc;
  --color-palette9: #f4e8e6;  /* Beige très clair */
}
```

### Couleurs sémantiques

```css
:root {
  /* Arrière-plans */
  --header-backgrounnd: #fff8f5;    /* Fond header/cartes */
  --body-background: #f5e6e1;       /* Fond de page */
  --input-background: #fff8f5;      /* Fond des inputs */
  
  /* Textes */
  --login-btn-text: #5a4237;        /* Texte principal */
  --secondary-text-color: #8d6b6b;  /* Texte secondaire */
  
  /* Bordures */
  --border-color: #d4afa7;
  --login-btn-border: #d3ada4;
  --filters-border-color: #d7afa0;
  
  /* Boutons */
  --login-btn-background: #f5e6df;
  --login-btn-background-on-hover: #d9ada0;
  --sign-up-btn: #a74f4e;
  --sign-up-btn-on-hover: #ad5d5c;
  
  /* États spéciaux */
  --price-red: #c91239;             /* Prix/promotions */
  --destructive: #d4183d;           /* Actions destructives */
  --selected-option-background: #f6e7e4;
}
```

### Usage des couleurs

```css
/* Texte principal */
.title {
  color: var(--login-btn-text);
}

/* Texte secondaire */
.description {
  color: var(--secondary-text-color);
}

/* Bouton principal (Call-to-action) */
.btn-primary {
  background: var(--sign-up-btn);
  color: white;
}

.btn-primary:hover {
  background: var(--sign-up-btn-on-hover);
}

/* Bouton secondaire */
.btn-secondary {
  background: var(--login-btn-background);
  color: var(--login-btn-text);
  border: 1px solid var(--login-btn-border);
}

/* Prix / Offres spéciales */
.price {
  color: var(--price-red);
}
```

---

## Variables CSS

### Variables de design system

```css
:root {
  /* Rayons de bordure */
  --general-border-radius: 10px;
  
  /* Espacement (optionnel - à ajouter) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;
}
```

### Utilisation dans les composants

```css
/* Utiliser les variables */
.card {
  background: var(--header-backgrounnd);
  border: 1px solid var(--border-color);
  border-radius: var(--general-border-radius);
  padding: var(--spacing-lg);
  transition: all var(--transition-normal);
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
```

---

## Typographie

### Fonts utilisées

```css
/* Source Sans Pro - Police secondaire */
@font-face {
  font-family: 'Source Sans Pro';
  src: url(/assets/fonts/SourceSansPro/SourceSansPro-Light.ttf);
  font-weight: 100;
}
/* ... autres poids ... */

/* Outfit - Police principale pour les titres */
@font-face {
  font-family: 'Outfit';
  src: url('/assets/fonts/Outfit-VariableFont_wght.ttf');
}

/* Inter - Police pour le texte courant */
@font-face {
  font-family: 'inter';
  src: url('/assets/fonts/Inter_24pt-Regular.ttf');
  font-weight: 400;
}

/* Parisienne - Police décorative */
@font-face {
  font-family: 'Parisienne';
  src: url('/assets/fonts/Parisienne-Regular.ttf');
  font-weight: 400;
}
```

### Hiérarchie typographique

```css
/* Titres - Outfit */
h1, h2, h3, .title {
  font-family: 'Outfit', sans-serif;
  color: var(--login-btn-text);
}

h1 {
  font-size: 32px;
  font-weight: 600;
}

h2 {
  font-size: 24px;
  font-weight: 500;
}

h3 {
  font-size: 18px;
  font-weight: 400;
}

/* Texte courant - System fonts */
body, p, span, .text {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 
               'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 
               'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: var(--login-btn-text);
}

/* Texte secondaire */
.secondary-text {
  font-size: 12px;
  color: var(--secondary-text-color);
}

/* Labels de formulaire */
label {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--login-btn-text);
}
```

---

## Composants réutilisables

### Boutons

```css
/* Bouton de base */
.btn {
  padding: 10px 24px;
  border-radius: var(--general-border-radius);
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

/* Bouton principal */
.btn-primary {
  background: var(--sign-up-btn);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--sign-up-btn-on-hover);
}

/* Bouton secondaire */
.btn-secondary {
  background: var(--login-btn-background);
  color: var(--login-btn-text);
  border: 1px solid var(--login-btn-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--login-btn-background-on-hover);
}

/* Bouton destructif */
.btn-danger {
  background: var(--price-red);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #b70f2a;
}

/* État désactivé */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Cartes (Cards)

```css
.card {
  background: var(--header-backgrounnd);
  border: 1px solid var(--login-btn-border);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  width: 100%;
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--login-btn-border);
  border-radius: var(--general-border-radius);
  font-size: 14px;
  font-family: system-ui, sans-serif;
  background-color: var(--input-background);
  color: var(--login-btn-text);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--login-btn-text);
  box-shadow: 0 0 0 3px var(--login-btn-border);
}

.input::placeholder {
  color: var(--secondary-text-color);
}

/* État d'erreur */
.input.error {
  border-color: var(--price-red);
}
```

### Badges/Tags

```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: system-ui, sans-serif;
}

.badge-primary {
  background: var(--login-btn-background);
  color: var(--login-btn-text);
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-warning {
  background: #fff3cd;
  color: #856404;
}

.badge-danger {
  background: #f8d7da;
  color: #721c24;
}
```

---

## Layouts

### Conteneurs globaux

```css
/* Conteneur centré */
.container {
  max-width: 1262px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Layout horizontal */
.horizontal-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin: 20px 60px;
}

/* Layout vertical */
.vertical-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 20px 60px;
}

/* Pleine largeur */
.full-width-container {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Grilles

```css
/* Grille responsive produits */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* Grille 2 colonnes */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* Grille 3 colonnes */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Grille 4 colonnes */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
```

---

## Animations

### Animations globales

```css
/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide down */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide up */
@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Spin (pour loaders) */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### Messages de notification

```css
.global-message {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 32px;
  border-radius: 0 0 12px 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 500;
  z-index: 10000;
  min-width: 400px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.5s ease-out;
}

.global-message.hiding {
  animation: slideUp 0.5s ease-in forwards;
}

.success-message {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-top: none;
  color: #155724;
}

.error-message {
  background-color: #ffe6e6;
  border: 1px solid #ffcccc;
  border-top: none;
  color: #d9534f;
}
```

### Transitions sur hover

```css
/* Transition douce sur tous les éléments interactifs */
.btn, .card, .input, a {
  transition: all 0.2s ease;
}

/* Hover sur cartes */
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Hover sur liens */
a:hover {
  opacity: 0.8;
}
```

---

## Responsive design

### Breakpoints recommandés

```css
/* Mobile first approach */

/* Extra small devices (phones, less than 576px) */
@media (max-width: 575.98px) {
  .container {
    padding: 0 10px;
  }
  
  h1 {
    font-size: 24px;
  }
}

/* Small devices (tablets, 576px and up) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Styles pour tablettes */
}

/* Medium devices (desktops, 768px and up) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large devices (large desktops, 992px and up) */
@media (min-width: 992px) {
  /* Styles pour grands écrans */
}
```

### Exemple de composant responsive

```css
/* Product card */
.product-card {
  width: 400px;
  padding: 24px;
}

/* Tablette */
@media (max-width: 768px) {
  .product-card {
    width: 100%;
    padding: 16px;
  }
  
  .product-image {
    height: 200px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .product-card {
    padding: 12px;
  }
  
  .product-title {
    font-size: 16px;
  }
}
```

---

## Bonnes pratiques

### 1. Utiliser les variables CSS

```css
/* ❌ Éviter */
.btn {
  background: #a74f4e;
  color: #5a4237;
}

/* ✅ Préférer */
.btn {
  background: var(--sign-up-btn);
  color: var(--login-btn-text);
}
```

### 2. BEM-like naming

```css
/* Bloc */
.product-card { }

/* Élément */
.product-card__title { }
.product-card__price { }

/* Modificateur */
.product-card--featured { }
.product-card--discount { }
```

### 3. Éviter les styles inline

```html
<!-- ❌ Éviter -->
<div style="color: red; padding: 10px;">Content</div>

<!-- ✅ Préférer -->
<div class="error-message">Content</div>
```

### 4. Utiliser des classes utilitaires

```css
/* Classes utilitaires réutilisables */
.text-center { text-align: center; }
.text-right { text-align: right; }
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mb-1 { margin-bottom: 8px; }
.p-1 { padding: 8px; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
```

### 5. Encapsulation des styles

```typescript
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
  encapsulation: ViewEncapsulation.Emulated // Par défaut
})
```

### 6. Accessibilité

```css
/* Focus visible pour la navigation au clavier */
.btn:focus-visible {
  outline: 2px solid var(--sign-up-btn);
  outline-offset: 2px;
}

/* Contraste suffisant */
.text {
  color: var(--login-btn-text); /* Ratio de contraste >= 4.5:1 */
}

/* Tailles de clic suffisantes (minimum 44x44px) */
.btn {
  min-height: 44px;
  min-width: 44px;
}
```

### 7. Performance

```css
/* Utiliser transform et opacity pour les animations */
/* ✅ Bon (GPU accelerated) */
.card {
  transition: transform 0.2s, opacity 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

/* ❌ Éviter (cause reflow) */
.card {
  transition: top 0.2s, height 0.2s;
}
```

---

## Checklist de style

Avant de valider un composant, vérifier :

- [ ] Les variables CSS sont utilisées pour les couleurs
- [ ] La typographie suit la hiérarchie définie
- [ ] Le composant est responsive (mobile, tablette, desktop)
- [ ] Les transitions sont fluides (0.2s - 0.3s)
- [ ] Le focus clavier est visible
- [ ] Les boutons ont une taille minimale de 44x44px
- [ ] Le contraste des couleurs est suffisant (WCAG AA)
- [ ] Les états hover/active/disabled sont définis
- [ ] Pas de styles inline dans le template
- [ ] Les animations sont performantes (transform/opacity)

---

## Ressources

### Outils utiles

- **Color Contrast Checker** : https://webaim.org/resources/contrastchecker/
- **CSS Variables Generator** : https://cssvariables.net/
- **Responsive Design Checker** : DevTools Chrome/Firefox

### Documentation Angular

- **Component Styles** : https://angular.dev/guide/components/styling
- **View Encapsulation** : https://angular.dev/api/core/ViewEncapsulation

---

## Conclusion

Le système de styles d'ArtisanArt repose sur :
- Une palette de couleurs cohérente et chaleureuse
- Des variables CSS pour la maintenabilité
- Des composants réutilisables bien définis
- Une approche mobile-first responsive
- Des animations fluides et performantes

**Pour étendre le système :**
1. Ajouter de nouvelles variables dans `styles.css`
2. Créer des classes utilitaires réutilisables
3. Documenter les nouveaux composants
4. Tester sur tous les breakpoints
5. Vérifier l'accessibilité (contraste, focus, etc.)