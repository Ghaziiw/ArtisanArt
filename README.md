<p align="center">
    <picture>
        <img src="./docs/images/logo.svg" width=450px>
    </picture>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Made%20with-NestJS-red.svg">
    <img src="https://img.shields.io/badge/Database-PostgreSQL-blue.svg">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
    <img src="https://img.shields.io/badge/Groupe-IGL3-yellow.svg">
</p>

---
# ArtisanArt – Backend

ArtisanArt-backend est l’API officielle du projet **ArtisanArt**, une plateforme permettant
aux artisans de publier leurs produits, gérer leurs offres, et permettre aux utilisateurs
de consulter, filtrer et acheter des produits artisanaux.

Ce backend a été développé avec **NestJS**, **TypeORM**, et une architecture modulaire évolutive.
Il expose des endpoints REST sécurisés, gère l’upload d’images, l’authentification, 
la gestion des rôles, ainsi que des opérations CRUD complètes.

---

## Fonctionnalités principales

- Authentification & Autorisation (Better-Auth, JWT)
- Gestion des artisans (Craftsman)
- Gestion des produits (Product)
- Gestion des catégories & spécialités
- Upload d’images
- Ajustement automatique des prix via une couche métier
- Système d’offres (Offer)
- Filtrage dynamique (via DTO)
- Pagination standardisée
- Architecture modulaire propre

---

## 📂 Documentation

- **Structure du projet** → [`docs/STRUCTURE.md`](docs/STRUCTURE.md)
- **Technologies utilisées** → [`docs/TECHNOLOGIES.md`](docs/TECHNOLOGIES.md)
- **Requêtes API** → [`docs/API_REQUESTS.md`](docs/API_REQUESTS.md)

---

## 🛠 Installation & lancement

### 1) Cloner le dépôt
```bash
git clone https://github.com/MohamedAffes0/ArtisanArt-backend
```

### 2) Se déplacer dans le dossier
```bash
cd ArtisanArt-backend
```

### 3) Installer les dépendances
```bash
npm install
```

### 4) Générer la configuration Better-Auth
```bash
npx @better-auth/cli generate
```

### 5) Appliquer les migrations Better-Auth
```bash
npx @better-auth/cli migrate
```

### 6) Lancer en développement
```bash
npm run start:dev
```

---

## 🛠️ Configuration des variables d’environnement

Pour que l’application fonctionne correctement, vous devez créer un fichier `.env` à la racine du projet.  
Ce fichier contient toutes les informations nécessaires au fonctionnement :

- connexion à la base de données  
- configuration de l’application  
- paramètres de Better Auth  
- URL du serveur  
- paramètres de Multer  

Voici un exemple complet de configuration :

```env
# Database configuration
DB_USERNAME=postgres
DB_PASSWORD=2426
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=artisanart

# URL complète utilisée par Better Auth et TypeORM
DATABASE_URL=postgres://postgres:2426@localhost:5432/artisanart


# Application configuration
NODE_ENV=development
PORT=3000

# Better Auth configuration
BETTER_AUTH_SECRET=abcd1234efgh5678
BETTER_AUTH_URL=http://localhost:3000

# Multer configuration
MULTER_BASE_URL=http://localhost:3000
```