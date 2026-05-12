# Technologies utilisées – ArtisanArt Backend

---

## Langage & Framework

### **NestJS**
Framework backend NodeJS basé sur :
- Decorators
- Architecture modulaire
- Inversion de contrôle (IoC)
- Pipes, Guards, Interceptors

### **TypeScript**
Langage principal, typage strict pour une meilleure fiabilité.

---

## Base de données

### **PostgreSQL**
Système de base de données relationnelle.

### **TypeORM**
ORM permettant :
- Migrations
- Repositories
- Relations entités
- Requêtes optimisées

---

## Authentification & sécurité

- **Better-Auth / JWT**
- Intercepteurs pour protéger les routes
- Guards personnalisés
- Permissions basées sur le rôle

---

## Upload & stockage

- `Multer` via `@nestjs/platform-express`
- Validations fichiers

---

## Outils de développement

- ESLint & Prettier
- Dotenv
- Class-validator / class-transformer
- GitHub Actions (CI futur)