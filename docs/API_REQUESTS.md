# Guide Complet des Commandes cURL - API Artisan

## Table des Matières

1.  [Authentication (Better Auth)](#authentication)
2.  [Users](#users)
3.  [Craftsmen](#craftsmen)
4.  [Categories](#categories)
5.  [Products](#products)
6.  [Offers](#offers)
7.  [Comments](#comments)
8.  [Shopping Cart](#shopping-cart)
9.  [Orders](#orders)
10. [App Routes](#app-routes)

---

## 1. Authentication (Better Auth) {#authentication}

### Inscription (Sign Up)

#### Inscription d'un nouveau client

```bash
curl -X POST "http://localhost:3000/api/auth/sign-up/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "client@example.com",
        "password": "Password123",
        "name": "John Doe",
        "location": "Tunis"
    }'
```

> **Remarque :** Les champs optionnels sont :
>
> - `location`

### Connexion (Sign In)

#### Connexion d'un utilisateur

```bash
curl -X POST "http://localhost:3000/api/auth/sign-in/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "client@example.com",
        "password": "Password123"
    }' \
-c cookies.txt
```

### Déconnexion (Sign Out)

```bash
curl -X POST http://localhost:3000/api/auth/sign-out \
-H "Origin: http://localhost:3000" \
-b cookies.txt \
-c cookies.txt
```

### Obtenir la session courante

```bash
curl -X GET "http://localhost:3000/api/auth/get-session" \
-b cookies.txt
```

---

## 2. Users {#users}

### Lister tous les utilisateurs (Admin)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** `email`, `name`, `role`, `createdAtMin`, `createdAtMax`

```bash
curl -X GET "http://localhost:3000/users?page=1&limit=20" \
-b cookies.txt
```

**Exemple avec filtres :**
```bash
curl -X GET "http://localhost:3000/users?page=1&limit=20&role=artisan&name=John" \
-b cookies.txt
```

### Upload Image de Profil

```bash
curl -X PATCH "http://localhost:3000/users/profile/me/image" \
-b cookies.txt \
-F "profileImage=@/chemin/vers/ton/image.jpg"
```

> **Validations :**
>
> - Maximum `1 image` par profile
> - Taille max `1MB`
> - Types acceptés: `jpg`, `jpeg`, `png`, `webp`

### Upload Image de Profil (Admin)

```bash
curl -X PATCH "http://localhost:3000/users/:userId/image" \
-b cookies.txt \
-F "profileImage=@/chemin/vers/ton/image.jpg"
```

### Supprimer Image de Profil

```bash
curl -X DELETE "http://localhost:3000/users/profile/me/image" \
-b cookies.txt \
```

### Obtenir mon profil

```bash
curl -X GET "http://localhost:3000/users/profile/me" \
-b cookies.txt
```

### Obtenir un utilisateur par ID (Admin)

```bash
curl -X GET "http://localhost:3000/users/id_expl" \
-b cookies.txt
```

### Mettre à jour mon profil

```bash
curl -X PATCH "http://localhost:3000/users/profile/me" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "name": "John Updated",
        "location": "Ariana",
        "image": "https://example.com/avatar.jpg",
        "email": "newmail@gmail.com"
    }'
```

> **Remarque :** Les champs optionnels sont :
>
> - `name`
> - `location`
> - `image`
> - `email`

### Changer mon mot de passe

```bash
curl -X PATCH "http://localhost:3000/users/profile/password" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "currentPassword": "Password123",
        "newPassword": "NewPassword456"
    }'
```

### Créer un utilisateur admin (Admin)

```bash
curl -X POST "http://localhost:3000/users/admin" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "email": "newuser@example.com",
        "name": "New User",
        "password": "Password123",
        "image": "https://picsum.photos/id/237/200/300",
        "location": "sfax, gremda"
    }'
```

> **Remarque :** Les champs optionnels sont :
>
> - `image`
> - `location`

### Mettre à jour un utilisateur (Admin)

```bash
curl -X PATCH "http://localhost:3000/users/id_expl" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "name": "Updated Name",
        "email": "updated@example.com",
        "image": "https://picsum.photos/id/237/200/300",
        "location": "sfax, gremda"
    }'
```

> **Remarque :** Les champs optionnels sont :
>
> - `name`
> - `location`
> - `image`
> - `email`

### Supprimer un utilisateur (Admin)

```bash
curl -X DELETE "http://localhost:3000/users/id_expl" \
-b cookies.txt
```

---

## 3. Craftsmen {#craftsmen}

### Lister tous les artisans (Public)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** `businessName`, `specialty`

```bash
curl -X GET "http://localhost:3000/craftsmen?page=1&limit=20"
```

**Exemple avec filtres :**
```bash
curl -X GET "http://localhost:3000/craftsmen?page=1&limit=20&specialty=Pottery&businessName=Ahmed"
```

### Lister tous les artisans - Vue Admin (Admin)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** `businessName`, `specialty`, `expirationDateMin`, `expirationDateMax`

```bash
curl -X GET "http://localhost:3000/craftsmen/admin?page=1&limit=20" \
-b cookies.txt
```

**Exemple avec filtres :**
```bash
curl -X GET "http://localhost:3000/craftsmen/admin?page=1&limit=20&expirationDateMin=2025-01-01&expirationDateMax=2025-12-31" \
-b cookies.txt
```

### Obtenir un artisan par user ID (Public)

```bash
curl -X GET "http://localhost:3000/craftsmen/id_expl"
```

### Créer un profil d'artisan

```bash
curl -X POST "http://localhost:3000/craftsmen" \
-H "Content-Type: multipart/form-data" \
-F "email=artisan@example.com" \
-F "password=Password123" \
-F "name=Mohcen" \
-F "location=Sfax, gremda" \
-F "businessName=Ahmed Pottery Workshop" \
-F "bio=Traditional Tunisian pottery" \
-F "specialty=Pottery" \
-F "phone=12345678" \
-F "workshopAddress=sfax, gremda km7" \
-F "deliveryPrice=5.50" \
-F "instagram=https://instagram.com" \
-F "facebook=https://facebook.com" \
-F "image=https://example.com/profile.jpg" \
-F "profileImage=@/home/medaffes/Downloads/image.jpg"
```

> **Remarque :** Les champs optionnels sont :
>
> - `image`
> - `location`
> - `bio`
> - `specialty`
> - `instagram`
> - `facebook`
> - `profileImage`

### Upload Image de Profil Artisan

```bash
curl -X PATCH "http://localhost:3000/craftsmen/profile/me/image" \
-b cookies.txt \
-F "profileImage=@/chemin/vers/ton/image.jpg"
```

> **Validations :**
>
> - Maximum `1 image` par profile
> - Taille max `1MB`
> - Types acceptés: `jpg`, `jpeg`, `png`, `webp`

### Obtenir mon profil d'artisan

```bash
curl -X GET "http://localhost:3000/craftsmen/profile/me" \
-b cookies.txt
```

### Mettre à jour mon profil d'artisan

```bash
curl -X PATCH "http://localhost:3000/craftsmen/profile/me" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "name": "affes",
        "email": "expl@mail.com",
        "image": "https://example.com/profile.jpg",
        "location": "gremda",
        "businessName": "Updated Workshop",
        "bio": "Updated bio",
        "specialty": "mohcen",
        "phone": "87654321",
        "workshopAddress": "sfax",
        "instagram": "https://instagram.com",
        "facebook": "https://facebook.com",
        "profileImage": "https://example.com/profile.jpg",
        "deliveryPrice": 6.00
    }'
```

> **Remarque :** Les champs optionnels sont :
>
> - `name`
> - `email`
> - `image`
> - `location`
> - `businessName`
> - `bio`
> - `specialty`
> - `phone`
> - `workshopAddress`
> - `instagram`
> - `facebook`
> - `deliveryPrice`
> - `profileImage`

### Mettre à jour un artisan (Admin)

```bash
curl -X PATCH "http://localhost:3000/craftsmen/id_expl" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "name": "affes",
        "email": "expl@mail.com",
        "image": "https://example.com/profile.jpg",
        "location": "gremda",
        "businessName": "Updated Workshop",
        "bio": "Updated bio",
        "specialty": "mohcen",
        "phone": "87654321",
        "workshopAddress": "sfax",
        "instagram": "https://instagram.com",
        "facebook": "https://facebook.com",
        "profileImage": "https://example.com/profile.jpg",
        "deliveryPrice": 6.00
    }'
```

> **Remarque :** Les champs optionnels sont :
>
> - `name`
> - `email`
> - `image`
> - `location`
> - `businessName`
> - `bio`
> - `specialty`
> - `phone`
> - `workshopAddress`
> - `instagram`
> - `facebook`
> - `deliveryPrice`
> - `profileImage`

### Mettre à jour la date d'expiration (Admin)

```bash
curl -X PATCH "http://localhost:3000/craftsmen/id_expl/exp" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "newExpDate": "2025-12-31"
    }'
```

### Supprimer mon profil d'artisan

```bash
curl -X DELETE "http://localhost:3000/craftsmen/profile/me" \
-b cookies.txt
```

### Supprimer un artisan (Admin)

```bash
curl -X DELETE "http://localhost:3000/craftsmen/id_expl" \
-b cookies.txt
```

---

## 4. Categories {#categories}

### Lister toutes les catégories (Public)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** Aucun

```bash
curl -X GET "http://localhost:3000/categories?page=1&limit=20"
```

### Obtenir une catégorie par ID (Public)

```bash
curl -X GET "http://localhost:3000/categories/id_expl"
```

### Créer une catégorie (Admin)

```bash
curl -X POST "http://localhost:3000/categories" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "name": "Pottery"
    }'
```

### Mettre à jour une catégorie (Admin)

```bash
curl -X PATCH "http://localhost:3000/categories/id_expl" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "name": "Ceramics"
    }'
```

### Supprimer une catégorie (Admin)

```bash
curl -X DELETE "http://localhost:3000/categories/id_expl" \
-b cookies.txt
```

---

## 5. Products {#products}

### Lister tous les produits (Public)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** `name`, `categoriesId`, `minPrice`, `maxPrice`, `sortByPrice`, `craftsmanName`, `craftsmanId`, `minRating`, `freeShipping`                

```bash
curl -X GET "http://localhost:3000/products?page=1&limit=20"
```

**Exemple avec filtres :**
```bash
curl -X GET "http://localhost:3000/products?page=1&limit=20&minPrice=20&maxPrice=100&sortByPrice=asc&name=vase&categoryId=category-uuid"
```

### Obtenir un produit par ID (Public)

```bash
curl -X GET "http://localhost:3000/products/id_expl"
```

### Créer un produit (Artisan)

```bash
curl -X POST "http://localhost:3000/products" \
-b cookies.txt \
-F "name=Vase Artisanal" \
-F "description=Magnifique vase fait main en céramique" \
-F "price=45.99" \
-F "stock=10" \
-F "categoryId=id_expl" \
-F "images=@/chemin/vers/ton/image1.jpg" \
-F "images=@/chemin/vers/ton/image2.jpg"
```

> **Remarque :** Les champs optionnels sont :
>
> - `categoryId`
> - `images`
>
> **Validations :**
>
> - Maximum `5 images` par produit
> - Taille max `1MB` par image
> - Types acceptés: `jpg`, `jpeg`, `png`, `webp`

### Mettre à jour un produit (Artisan/Admin)

```bash
curl -X PATCH "http://localhost:3000/products/<product_id>" \
-b cookies.txt \
-H "Content-Type: multipart/form-data" \
-F "name=Traditional Vase" \
-F "description=Handmade traditional Tunisian vase" \
-F "price=45.99" \
-F "stock=10" \
-F "categoryId=<category_id>" \
-F "images=@./vase1.jpg" \
-F "images=@./vase2.jpg"
```

> **Remarque :** Les champs optionnels sont :
>
> - `categoryId`
> - `images`

### Mettre à Jour les Images d'un Produit

```bash
curl -X PATCH "http://localhost:3000/products/id_expl/images" \
-b cookies.txt \
-F "images=@/chemin/vers/image1.jpg" \
-F "images=@/chemin/vers/image2.png" \
-F "replaceAll=false"
```
> **Remarque :**
>- `replaceAll`: string ("true" ou "false")
> >- `"true"`: Remplace toutes les images existantes
> >- `"false"`: Ajoute les nouvelles images aux existante (défaut)
>
> **Validations :**
>
> - Maximum `5 images` par produit
> - Taille max `1MB` par image
> - Types acceptés: `jpg`, `jpeg`, `png`, `webp`

### Supprimer un produit (Artisan/Admin)

```bash
curl -X DELETE "http://localhost:3000/products/id_expl" \
-b cookies.txt
```

---

## 6. Offers {#offers}

### Lister toutes les offres (Public)

**Pagination :** Non  
**Filtres :** Aucun

```bash
curl -X GET "http://localhost:3000/offers"
```

### Obtenir une offre par product ID (Public)

```bash
curl -X GET "http://localhost:3000/offers/id_expl"
```

### Créer une offre (Artisan)

```bash
curl -X POST "http://localhost:3000/offers" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "productId": "id_expl",
        "percentage": 20,
        "startDate": "2025-01-01",
        "endDate": "2025-01-31"
    }'
```

> **Remarque :** Les champs optionnels sont :
>
> - `endDate`

### Mettre à jour une offre (Artisan)

```bash
curl -X PATCH "http://localhost:3000/offers/id_expl" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "percentage": 25,
        "startDate": "2025-02-15",
        "endDate": "2025-02-15"
    }'
```

> **Remarque :** Les champs optionnels sont :
>
> - `percentage`
> - `startDate`
> - `endDate`

### Supprimer une offre (Artisan)

```bash
curl -X DELETE "http://localhost:3000/offers/id_expl" \
-b cookies.txt
```

---

## 7. Comments {#comments}

### Lister tous les commentaires (Public)

**Pagination :** Non  
**Filtres :** Aucun

```bash
curl -X GET "http://localhost:3000/comments"
```

### Obtenir les commentaires d'un produit (Public)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** Aucun (filtre automatique par `productId`)

```bash
curl -X GET "http://localhost:3000/comments/id_expl?page=1&limit=20"
```

### Créer un commentaire (Authentifié)

```bash
curl -X POST "http://localhost:3000/comments" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "productId": "id_expl",
        "content": "Excellent product, highly recommended!",
        "mark": 5
    }'
```

### Supprimer un commentaire (Propriétaire)

```bash
curl -X DELETE "http://localhost:3000/comments/id_expl" \
-b cookies.txt
```

---

## 8. Shopping Cart {#shopping-cart}

### Obtenir mon panier

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** Aucun

```bash
curl -X GET "http://localhost:3000/shoppingcarts?page=1&limit=10" \
-b cookies.txt
```

### Obtenir le panier groupé par artisan

**Pagination :** Non  
**Filtres :** Aucun

```bash
curl -X GET "http://localhost:3000/shoppingcarts/craftsman-grouped" \
-b cookies.txt
```

### Ajouter un produit au panier

```bash
curl -X POST "http://localhost:3000/shoppingcarts" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "productId": "id_expl",
        "quantity": 2
    }'
```

> **Remarque :** Les champs optionnels sont :
>
> - `quantity`

### Mettre à jour la quantité d'un produit

```bash
curl -X PATCH "http://localhost:3000/shoppingcarts/id_expl" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "quantity": 5
    }'
```

### Supprimer un produit du panier (quantité à 0)

```bash
curl -X PATCH "http://localhost:3000/shoppingcarts/id_expl" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "quantity": 0
    }'
```

### Vider le panier

```bash
curl -X DELETE "http://localhost:3000/shoppingcarts" \
-b cookies.txt
```

---

## 9. Orders {#orders}

### Passer commande pour tous les artisans

```bash
curl -X POST "http://localhost:3000/orders/checkout" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "cin": "12345678",
        "location": "123 Main Street, Apartment 4B",
        "state": "Tunis",
        "phone": "12345678"
    }'
```

### Passer commande pour un artisan spécifique

```bash
curl -X POST "http://localhost:3000/orders/checkout/id_expl" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "cin": "12345678",
        "location": "123 Main Street, Apartment 4B",
        "state": "Tunis",
        "phone": "12345678"
    }'
```

### Obtenir mes commandes (Client)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** `status`, `craftsmanName`, `createdAtMin`, `createdAtMax`

```bash
curl -X GET "http://localhost:3000/orders?page=1&limit=20" \
-b cookies.txt
```

**Exemple avec filtres :**
```bash
curl -X GET "http://localhost:3000/orders?page=1&limit=20&status=PENDING&craftsmanName=Ahmed&createdAtMin=2025-01-01" \
-b cookies.txt
```

### Obtenir les commandes de mon atelier (Artisan)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** `status`, `createdAtMin`, `createdAtMax`

```bash
curl -X GET "http://localhost:3000/orders/craftsman?page=1&limit=20" \
-b cookies.txt
```

**Exemple avec filtres :**
```bash
curl -X GET "http://localhost:3000/orders/craftsman?page=1&limit=20&status=CONFIRMED&createdAtMin=2025-01-01" \
-b cookies.txt
```

### Obtenir les détails d'une commande

```bash
curl -X GET "http://localhost:3000/orders/id_expl" \
-b cookies.txt
```

### Annuler une commande (Client, statut PENDING uniquement)

```bash
curl -X GET "http://localhost:3000/orders/cancel/id_expl" \
-b cookies.txt
```

### Mettre à jour le statut d'une commande (Artisan)

#### Statuts possibles: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

```bash
curl -X PATCH "http://localhost:3000/orders/id_expl/status" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "status": "CONFIRMED"
    }'
```

#### Exemple: Marquer comme expédié

```bash
curl -X PATCH "http://localhost:3000/orders/id_expl/status" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "status": "SHIPPED"
    }'
```

#### Exemple: Marquer comme livré

```bash
curl -X PATCH "http://localhost:3000/orders/id_expl/status" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "status": "DELIVERED"
    }'
```

---

## 10. App Routes {#app-routes}

### Route publique (Hello World)

```bash
curl -X GET "http://localhost:3000/"
```

### Route privée (Authentification requise)

```bash
curl -X GET "http://localhost:3000/private" \
-b cookies.txt
```

### Route admin (Rôle admin requis)

```bash
curl -X GET "http://localhost:3000/admin" \
-b cookies.txt
```

---

## Notes importantes

1.  **Cookies vs Headers**: Better Auth utilise des cookies pour la session. Utilisez `-c cookies.txt` pour sauvegarder et `-b cookies.txt` pour charger les cookies.
2.  **Format des dates**: Utilisez le format ISO 8601 (YYYY-MM-DD) pour les dates.
3.  **UUIDs**: Remplacez les exemples d'UUID par les vrais IDs de votre base de données.
4.  **États tunisiens**: Utilisez les valeurs de l'enum `TunisianState` pour le champ `state` dans les commandes.
5.  **Statuts de commande**: Les transitions de statut sont validées. Voir la méthode `validateStatusChange` pour les règles.
6.  **Permissions**: Certaines routes nécessitent des rôles spécifiques (admin, artisan, client).
7.  **Validation**: Tous les DTOs ont des validations. Assurez-vous que vos données respectent les contraintes.
8.  **Pagination**: Par défaut, `page=1` et `limit=20`. Ajustez selon vos besoins.
9.  **Filtres**: Les filtres textuels utilisent la recherche partielle et insensible à la casse (ILIKE).
10. **Combinaison de filtres**: Vous pouvez combiner plusieurs filtres dans une même requête.
11. **Types de Fichiers Acceptés**: `jpeg`, `jpg`, `png`, `webp`
12. **Limitations des Fichiers Acceptés**:
- Taille maximale par fichier: `1MB`
- Nombre maximum d'images par produit: 5
- Nombre maximum d'images par upload: 5
