<p align="center">
    <picture>
        <img src="./docs/images/logo.svg" width=450px>
    </picture>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Made_with-Angular-red.svg">
    <img src="https://img.shields.io/badge/API-REST-blue.svg">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
    <img src="https://img.shields.io/badge/Groupe-IGL3-yellow.svg">
</p>

## Screenshot

<p>
    <img src="https://github.com/MohamedAffes0/ArtisanArt-frontend/blob/Mohamed/docs/images/screenshot1.png">
</p>

<p>
    <img src="https://github.com/MohamedAffes0/ArtisanArt-frontend/blob/Mohamed/docs/images/screenshot2.png">
</p>

<p>
    <img src="https://github.com/MohamedAffes0/ArtisanArt-frontend/blob/Mohamed/docs/images/screenshot3.png">
</p>

<p>
    <img src="https://github.com/MohamedAffes0/ArtisanArt-frontend/blob/Mohamed/docs/images/screenshot4.png">
</p>

## Vue d'ensemble

**ArtisanArt** est une plateforme e-commerce moderne dédiée à la mise en valeur des artisans locaux et de leurs produits artisanaux. Elle permet aux artisans de créer leurs boutiques en ligne et aux clients de découvrir et acheter des produits uniques faits main.

### Objectifs principaux
- Connecter les artisans locaux avec des acheteurs
- Faciliter la vente de produits artisanaux
- Offrir une expérience utilisateur moderne et intuitive
- Gérer efficacement les commandes et les boutiques

## Technologies utilisées

### Frontend
- **Framework**: Angular 19.1.5
- **Langage**: TypeScript 5.7.2
- **Styling**: CSS personnalisé avec variables CSS
- **Rendu**: Server-Side Rendering (SSR) avec Angular Universal

### Backend & Services
- **API Backend**: Node.js/Express (http://localhost:3000)
- **Authentification**: Better Auth 1.0.14
- **HTTP Client**: Angular HttpClient
- **State Management**: RxJS avec BehaviorSubjects

### Build & Outils
- **Build Tool**: Angular CLI avec esbuild
- **Package Manager**: npm
- **Node Version**: >=18.19.1

## Documentation

La documentation complète est organisée en plusieurs sections :

1. [Installation et Configuration](./docs/01-INSTALLATION.md)
2. [Architecture du Projet](./docs/ARCHITECTURE.md)
3. [Services et API](./docs/SERVICES.md)
4. [Modèles de Données](./docs/04-MODELS.md)
5. [Authentification](./docs/05-AUTHENTICATION.md)
6. [Routing et Navigation](./docs/06-ROUTING.md)
7. [Styles et Thème](./docs/07-STYLES.md)
8. [Guide de Développement](./docs/08-DEVELOPMENT.md)
9. [Déploiement](./docs/09-DEPLOYMENT.md)

## Démarrage rapide

```bash
# Cloner le projet
git clone [url-du-repo]
cd artisanart

# Installer les dépendances
npm install

# Configurer l'URL du backend
# Modifier src/lib/auth-client.ts si nécessaire

# Lancer l'application en développement
npm start

# Accéder à l'application
# http://localhost:4200
```

## Structure du projet

```
src/
├── app/
│   ├── core/              # Services et modèles essentiels
│   ├── features/          # Modules fonctionnels
│   ├── shared/            # Composants partagés
│   └── app.routes.ts      # Configuration routing
├── assets/                # Ressources statiques
├── lib/                   # Bibliothèques externes
└── styles.css             # Styles globaux
```

Pour plus de détails, voir [Architecture du Projet](./docs/02-ARCHITECTURE.md).

## Types d'utilisateurs

### Client
- Parcourir et acheter des produits
- Gérer son panier et ses commandes
- Laisser des avis sur les produits

### Artisan
- Créer et gérer sa boutique
- Ajouter/modifier/supprimer des produits
- Gérer les commandes reçues
- Voir les statistiques de vente

### Administrateur
- Gérer tous les utilisateurs
- Gérer les catégories
- Renouveler les abonnements artisans
- Accéder aux statistiques globales

## Fonctionnalités principales

### Pour les Clients
- Recherche avancée avec filtres
- Système de panier groupé par artisan
- Suivi des commandes
- Système d'avis et notes
- Gestion du profil

### Pour les Artisans
- Dashboard avec statistiques
- Gestion complète des produits
- Upload d'images multiples
- Gestion des commandes
- Profil public personnalisable

### Pour les Administrateurs
- Panel d'administration complet
- Gestion des utilisateurs
- Gestion des catégories
- Statistiques globales

## Scripts disponibles

```bash
# Développement
npm start              # Lance le serveur de dev
npm run watch          # Mode watch

# Build
npm run build          # Build pour production
npm run build:ssr      # Build avec SSR

# Tests
npm test               # Lance les tests unitaires
npm run test:watch     # Tests en mode watch

# Production
npm run serve:ssr:ArtisanArt  # Lance le serveur SSR
```

## Contribution

Les contributions sont les bienvenues ! Veuillez consulter le [Guide de Développement](./docs/08-DEVELOPMENT.md) pour les instructions détaillées.

### Processus de contribution
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request


## Licence

Ce projet est sous licence MIT
