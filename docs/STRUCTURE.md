# Structure et Description des Modules du Projet

## Structure Générale

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── auth/
├── config/
├── modules/
│   ├── user/
│   ├── craftsman/
│   ├── category/
│   ├── product/
│   ├── offer/
│   ├── comment/
│   ├── shoppingcart/
│   └── order/
└── utils/
```

---

## Module d'Authentification (`auth/`)

### Description
Gère l'authentification et l'autorisation des utilisateurs avec Better Auth, incluant les gardes, décorateurs et types personnalisés.

### Composants

#### **Decorators**
- `@CurrentUser()` - Extrait l'utilisateur authentifié de la requête
- `@Public()` - Marque une route comme publique (pas d'authentification requise)
- `@RequirePermissions()` - Spécifie les permissions requises pour accéder à une route

#### **Guards**
- `PermissionsGuard` - Vérifie les permissions utilisateur et l'authentification
- `CraftsmanExpirationGuard` - Vérifie si l'abonnement d'un artisan n'a pas expiré

#### **Types**
- `AuthUser` - Interface représentant un utilisateur authentifié
- `Permission` - Enum définissant toutes les permissions du système
- `UserRole` - Type pour les rôles utilisateur (admin, artisan, client)
- `ROLE_PERMISSIONS` - Mapping des rôles vers leurs permissions

### Permissions Disponibles
- **Produits**: view, create, update, delete
- **Commandes**: view, view:all, create, update, cancel, update:status
- **Utilisateurs**: view, create, update, delete
- **Statistiques**: view
- **Catégories**: create, update, delete
- **Offres**: create, update, delete
- **Panier**: manage
- **Artisans**: view, update, delete, update:exp

---

## Module Utilisateur (`user/`)

### Description
Gère les profils utilisateurs, incluant la création, modification, suppression et gestion des mots de passe.

### Entités
- **User**: id, email, name, image, location, role, createdAt, updatedAt

### Endpoints Principaux
- `GET /users` - Liste tous les utilisateurs (admin)
- `GET /users/profile/me` - Profil de l'utilisateur connecté
- `PATCH /users/profile/me` - Mise à jour du profil
- `PATCH /users/profile/password` - Changement de mot de passe
- `POST /users/admin` - Création d'un compte admin
- `GET /users/:id` - Détails d'un utilisateur
- `PATCH /users/:id` - Modification d'un utilisateur (admin)
- `DELETE /users/:id` - Suppression d'un utilisateur (admin)

### DTOs
- `CreateProfileDto` - Création d'un profil
- `UpdateProfileDto` - Mise à jour du profil
- `ChangePasswordDto` - Changement de mot de passe
- `UserFilterDto` - Filtrage des utilisateurs

### Filtres Disponibles
- email, name, role, createdAtMin, createdAtMax

---

## Module Artisan (`craftsman/`)

### Description
Gère les profils des artisans, leurs informations commerciales et dates d'expiration d'abonnement.

### Entités
- **Craftsman**: userId, businessName, bio, specialty, phone, workshopAddress, instagram, facebook, expirationDate, deliveryPrice, profileImage

### Endpoints Principaux
- `GET /craftsmen` - Liste des artisans (public)
- `GET /craftsmen/admin` - Liste des artisans (vue admin)
- `GET /craftsmen/profile/me` - Profil de l'artisan connecté
- `POST /craftsmen` - Création d'un profil artisan
- `PATCH /craftsmen/profile/me` - Mise à jour du profil
- `PATCH /craftsmen/:id` - Modification par admin
- `PATCH /craftsmen/:id/exp` - Mise à jour de la date d'expiration
- `DELETE /craftsmen/:id` - Suppression d'un artisan

### DTOs
- `CreateCraftsmanDto` - Création d'un artisan
- `UpdateCraftsmanDto` - Mise à jour d'un artisan
- `UpdateCraftsmanExpDateDto` - Mise à jour de la date d'expiration
- `CraftsmanFilterDto` - Filtrage des artisans

### Filtres Disponibles
- businessName, specialty, expirationDateMin, expirationDateMax (admin uniquement)

### Fonctionnalités Spéciales
- Création automatique d'un compte utilisateur avec rôle "artisan"
- Gestion de la date d'expiration d'abonnement
- Validation du numéro de téléphone (8 chiffres, ne commence pas par 0)

---

## Module Catégorie (`category/`)

### Description
Gère les catégories de produits pour l'organisation du catalogue.

### Entités
- **Category**: id, name, products

### Endpoints Principaux
- `GET /categories` - Liste des catégories (public, paginée)
- `GET /categories/:id` - Détails d'une catégorie
- `POST /categories` - Création d'une catégorie (admin)
- `PATCH /categories/:id` - Mise à jour d'une catégorie (admin)
- `DELETE /categories/:id` - Suppression d'une catégorie (admin)

### DTOs
- `CategoryDto` - Création et mise à jour d'une catégorie

### Validation
- Nom unique
- Minimum 2 caractères

---

## Module Produit (`product/`)

### Description
Gère le catalogue de produits des artisans avec images, stock et catégories.

### Entités
- **Product**: id, name, description, price, stock, categoryId, images, craftsmanId, createdAt, updatedAt, offer, comments

### Endpoints Principaux
- `GET /products` - Liste des produits (public, paginée, filtrée)
- `GET /products/:id` - Détails d'un produit
- `POST /products` - Création d'un produit (artisan)
- `PATCH /products/:id` - Mise à jour d'un produit (artisan)
- `DELETE /products/:id` - Suppression d'un produit (artisan)

### DTOs
- `CreateProductDto` - Création d'un produit
- `UpdateProductDto` - Mise à jour d'un produit
- `ProductFilterDto` - Filtrage des produits

### Filtres Disponibles
- name, categoryId, minPrice, maxPrice, sortByPrice (asc/desc), craftsmanName

### Fonctionnalités Spéciales
- Suppression automatique des offres invalides/expirées
- Relation avec catégories et artisans
- Support multi-images
- Gestion du stock

---

## Module Offre (`offer/`)

### Description
Gère les promotions et réductions sur les produits.

### Entités
- **Offer**: productId, percentage, startDate, endDate

### Endpoints Principaux
- `GET /offers` - Liste des offres (public)
- `GET /offers/:productId` - Offre d'un produit spécifique
- `POST /offers` - Création d'une offre (artisan)
- `PATCH /offers/:productId` - Mise à jour d'une offre (artisan)
- `DELETE /offers/:productId` - Suppression d'une offre (artisan)

### DTOs
- `CreateOfferDto` - Création d'une offre
- `UpdateOfferDto` - Mise à jour d'une offre

### Validation
- Pourcentage entre 0 et 100
- Date de fin postérieure à la date de début
- Une seule offre par produit
- Vérification de propriété (artisan propriétaire du produit)

### Fonctionnalités Spéciales
- Garde d'expiration d'artisan appliquée
- Relation one-to-one avec Product

---

## Module Commentaire (`comment/`)

### Description
Gère les avis et notes des clients sur les produits.

### Entités
- **Comment**: id, content, mark, userId, productId, createdAt

### Endpoints Principaux
- `GET /comments` - Liste de tous les commentaires (public)
- `GET /comments/:productId` - Commentaires d'un produit (paginés)
- `POST /comments` - Création d'un commentaire (authentifié)
- `DELETE /comments/:commentId` - Suppression d'un commentaire (propriétaire)

### DTOs
- `CreateCommentDto` - Création d'un commentaire

### Validation
- Note entre 1 et 5
- Contenu requis
- Vérification de propriété pour la suppression

### Fonctionnalités Spéciales
- Tri par date de création (DESC)
- Eager loading de l'utilisateur
- Cascade delete avec produit

---

## Module Panier (`shoppingcart/`)

### Description
Gère les paniers d'achat des clients avec groupement par artisan.

### Entités
- **ShoppingCart**: userId, productId, quantity, createdAt

### Endpoints Principaux
- `GET /shoppingcarts` - Contenu du panier (paginé)
- `GET /shoppingcarts/craftsman-grouped` - Panier groupé par artisan
- `POST /shoppingcarts` - Ajout d'un produit au panier
- `PATCH /shoppingcarts/:productId` - Mise à jour de la quantité
- `DELETE /shoppingcarts` - Vider le panier

### DTOs
- `CreateShoppingcartDto` - Ajout au panier
- `UpdateShoppingcartDto` - Mise à jour de la quantité
- `CraftsmanCartGroup` - Groupement par artisan

### Fonctionnalités Spéciales
- Vérification du stock disponible
- Groupement par artisan avec calcul des totaux
- Calcul du prix avec offres appliquées
- Frais de livraison par artisan
- Quantité à 0 supprime l'article

---

## Module Commande (`order/`)

### Description
Gère les commandes clients, leur statut et le suivi de livraison.

### Entités
- **Order**: id, userId, status, items, createdAt, cin, location, state, phone, deliveryPrice
- **OrderItem**: productId, orderId, quantity, priceAtOrder

### Endpoints Principaux
- `POST /orders/checkout` - Passer commande (tous les artisans)
- `POST /orders/checkout/:craftsmanId` - Passer commande (artisan spécifique)
- `GET /orders` - Commandes de l'utilisateur (filtrées, paginées)
- `GET /orders/craftsman` - Commandes de l'artisan
- `GET /orders/:orderId` - Détails d'une commande
- `GET /orders/cancel/:orderId` - Annuler une commande
- `PATCH /orders/:orderId/status` - Mise à jour du statut (artisan)

### DTOs
- `PlaceOrderDto` - Informations de livraison
- `UpdateOrderStatusDto` - Changement de statut
- `OrderFilterDto` - Filtrage des commandes
- `ViewOrderDto` - Vue commande avec artisan

### Statuts de Commande
- `PENDING` - En attente
- `CONFIRMED` - Confirmée
- `SHIPPED` - Expédiée
- `DELIVERED` - Livrée
- `CANCELLED` - Annulée

### Filtres Disponibles
- status, craftsmanName, createdAtMin, createdAtMax

### Fonctionnalités Spéciales
- Commandes séparées par artisan
- Gestion transactionnelle du stock
- Validation des transitions de statut
- Restauration du stock en cas d'annulation
- Prix fixé au moment de la commande (avec offres)
- États tunisiens (enum TunisianState)
- Validation CIN (8 chiffres)
- Validation téléphone (8 chiffres, ne commence pas par 0)

---

## Configuration (`config/`)

### database.config.ts
Configuration TypeORM pour la connexion PostgreSQL:
- Type: postgres
- Entités automatiquement chargées
- Synchronize activé en développement
- Logging activé en développement

---

## Utilitaires (`utils/`)

### auth.ts
Configuration Better Auth:
- Connexion PostgreSQL via Pool
- Authentification email/password
- Longueur minimale du mot de passe: 8 caractères
- Champs utilisateur personnalisés (role, location)
- Session de 1 jour
- Mode debug activé

---

## Point d'Entrée (`main.ts`)

### Configuration
- Body parser désactivé (requis pour better-auth)
- ValidationPipe global:
  - whitelist: true
  - forbidNonWhitelisted: true
  - transform: true
- Port: 3000 (par défaut) ou variable d'environnement

---

## Pagination

Tous les endpoints de liste utilisent la pagination avec:
- **Paramètres**: `page` (défaut: 1), `limit` (défaut: 20)
- **Réponse**:
  ```typescript
  {
    items: T[],
    meta: {
      totalItems: number,
      itemCount: number,
      itemsPerPage: number,
      totalPages: number,
      currentPage: number
    }
  }
  ```

---

## Sécurité

### Gardes Globaux
- `PermissionsGuard` - Appliqué sur les contrôleurs nécessitant une authentification
- `CraftsmanExpirationGuard` - Appliqué sur les actions d'artisans

### Routes Publiques
Marquées avec le décorateur `@Public()`:
- Lecture des produits, catégories, artisans
- Lecture des commentaires et offres
- Route racine

### Permissions par Rôle

**Client**:
- Voir les produits
- Gérer son panier
- Passer et annuler des commandes
- Voir ses commandes

**Artisan**:
- Toutes les permissions client
- Gérer ses produits
- Gérer ses offres
- Voir toutes les commandes de ses produits
- Mettre à jour le statut des commandes
- Voir les statistiques

**Admin**:
- Toutes les permissions
- Gérer les utilisateurs
- Gérer les artisans
- Gérer les catégories
- Voir le panneau d'administration
- Créer des comptes admin

---

## Notes Importantes

1. **Better Auth**: Gère l'authentification, NestJS gère l'autorisation
2. **Transactions**: Utilisées pour les opérations critiques (commandes, stock)
3. **Cascade**: Suppression en cascade configurée sur les relations critiques
4. **Validation**: DTOs avec class-validator pour toutes les entrées
5. **Eager Loading**: Configuré stratégiquement pour optimiser les requêtes
6. **Synchronize**: Désactivé pour l'entité User (gérée par Better Auth)