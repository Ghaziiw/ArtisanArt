<p align="center">
    <picture>
        <img src="./frontend/docs/images/logo.svg" width=450px>
    </picture>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Frontend-Angular-red.svg">
    <img src="https://img.shields.io/badge/Backend-NestJS-e0234e.svg">
    <img src="https://img.shields.io/badge/Database-PostgreSQL-blue.svg">
    <img src="https://img.shields.io/badge/API-REST-blue.svg">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
    <img src="https://img.shields.io/badge/Groupe-IGL3-yellow.svg">
</p>

---

# ArtisanArt

**ArtisanArt** est une plateforme e-commerce moderne dédiée à la mise en valeur des artisans locaux et de leurs produits artisanaux. Elle permet aux artisans de créer leurs boutiques en ligne et aux clients de découvrir et acheter des produits uniques faits main.

### Objectifs principaux
- Connecter les artisans locaux avec des acheteurs
- Faciliter la vente de produits artisanaux en ligne
- Offrir une expérience utilisateur moderne et intuitive
- Gérer efficacement les commandes, boutiques et abonnements

---

## Screenshots

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

---

## Structure du monorepo

```
ArtisanArt/
├── frontend/       # Application Angular (SSR)
└── backend/        # API REST NestJS
```

---

## Technologies utilisées

### Frontend
- **Framework**: Angular 19.1.5
- **Langage**: TypeScript 5.7.2
- **Styling**: CSS personnalisé avec variables CSS
- **Rendu**: Server-Side Rendering (SSR) avec Angular Universal
- **State Management**: RxJS avec BehaviorSubjects

### Backend
- **Framework**: NestJS avec TypeORM
- **Base de données**: PostgreSQL
- **Authentification**: Better-Auth + JWT
- **Upload d'images**: Multer
- **Architecture**: Modulaire et évolutive

### Build & Outils
- **Build Tool**: Angular CLI avec esbuild
- **Package Manager**: npm
- **Node Version**: >=18.19.1

---

## Fonctionnalités principales

### Pour les Clients
- Recherche avancée avec filtres dynamiques
- Système de panier groupé par artisan
- Suivi des commandes
- Système d'avis et notes
- Gestion du profil

### Pour les Artisans
- Dashboard avec statistiques de vente
- Gestion complète des produits (CRUD)
- Upload d'images multiples
- Gestion des commandes reçues
- Profil public personnalisable
- Système d'offres et abonnements

### Pour les Administrateurs
- Panel d'administration complet
- Gestion de tous les utilisateurs
- Gestion des catégories & spécialités
- Renouvellement des abonnements artisans
- Statistiques globales

### Backend — API
- Authentification & Autorisation (Better-Auth, JWT)
- Gestion des artisans, produits et catégories
- Ajustement automatique des prix via couche métier
- Filtrage dynamique via DTO
- Pagination standardisée

---

## Démarrage rapide

### Cloner le projet

```bash
git clone https://github.com/Ghaziiw/ArtisanArt
cd ArtisanArt
```

### Lancer le Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env (voir section Configuration)
cp .env.example .env

# Générer & appliquer les migrations Better-Auth
npx @better-auth/cli generate
npx @better-auth/cli migrate

# Lancer en développement
npm run start:dev
# API disponible sur http://localhost:3000
```

### Lancer le Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'URL du backend si nécessaire
# Modifier src/lib/auth-client.ts

# Lancer en développement
npm start
# Application disponible sur http://localhost:4200
```

---

## Configuration — Variables d'environnement (Backend)

Créer un fichier `.env` à la racine du dossier `backend/` :

```env
# Database configuration
DB_USERNAME = postgres
DB_PASSWORD = yourpassword
DB_HOST = localhost
DB_PORT = 5432
DB_DATABASE = artisanart

# Application configuration
NODE_ENV = development
PORT = 3000

# Better Auth configuration
BETTER_AUTH_SECRET = abcd1234efgh5678
BETTER_AUTH_URL = http://localhost:3000

# Multer configuration
MULTER_BASE_URL = http://localhost:3000
```

---

## Scripts disponibles

### Frontend

```bash
npm start              # Lance le serveur de développement
npm run build          # Build pour production
npm run build:ssr      # Build avec SSR
npm test               # Lance les tests unitaires
npm run serve:ssr:ArtisanArt  # Lance le serveur SSR
```

### Backend

```bash
npm run start:dev      # Lance en mode développement (watch)
npm run start:prod     # Lance en mode production
npm run build          # Compile le projet
npm test               # Lance les tests unitaires
npm run test:e2e       # Lance les tests end-to-end
```

---

## Documentation

### Frontend
1. [Installation et Configuration](./frontend/docs/INSTALLATION.md)
2. [Architecture du Projet](./frontend/docs/ARCHITECTURE.md)
3. [Services et API](./frontend/docs/SERVICES.md)
4. [Modèles de Données](./frontend/docs/MODELS.md)
5. [Authentification](./frontend/docs/AUTHENTICATION.md)
6. [Routing et Navigation](./frontend/docs/ROUTING.md)
7. [Styles et Thème](./frontend/docs/STYLES.md)
8. [Guide de Développement](./frontend/docs/DEVELOPMENT.md)
9. [Déploiement](./frontend/docs/09-DEPLOYMENT.md)

### Backend
- [Structure du projet](./backend/docs/STRUCTURE.md)
- [Technologies utilisées](./backend/docs/TECHNOLOGIES.md)
- [Requêtes API](./backend/docs/API_REQUESTS.md)

---

## Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## Licence

Ce projet est sous licence MIT.