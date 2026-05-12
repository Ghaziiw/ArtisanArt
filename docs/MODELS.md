# Modèles de données - ArtisanArt

Ce document décrit tous les modèles de données utilisés dans l'application ArtisanArt.

## Table des matières

- [User & Authentication](#user--authentication)
- [Craftsman](#craftsman)
- [Product](#product)
- [Order](#order)
- [Shopping Cart](#shopping-cart)
- [Category](#category)
- [Comment](#comment)
- [Offer](#offer)
- [Enums](#enums)

---

## User & Authentication

### User

Représente un utilisateur de la plateforme (client, artisan ou administrateur).

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;         // ISO 8601 date
  updatedAt: string;         // ISO 8601 date
  role: 'client' | 'artisan' | 'admin';
  location: string;
}
```

**Champs** :
- `id` : Identifiant unique
- `name` : Nom complet de l'utilisateur
- `email` : Email (unique)
- `emailVerified` : Statut de vérification de l'email
- `image` : URL de la photo de profil
- `role` : Rôle dans l'application
- `location` : Localisation géographique

### Session

Représente une session d'authentification active.

```typescript
interface Session {
  expiresAt: string;         // ISO 8601 date
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  id: string;
}
```

### SessionResponse

Réponse retournée lors de la récupération de session.

```typescript
interface SessionResponse {
  session: Session;
  user: User;
}
```

### DTOs d'authentification

#### ClientSignUpDto

```typescript
interface ClientSignUpDto {
  email: string;
  password: string;          // Min 8 caractères
  name: string;
  location?: string;
}
```

#### CraftsmanSignUpDto

```typescript
interface CraftsmanSignUpDto {
  email: string;
  password: string;
  name: string;
  location?: string;
  businessName: string;      // Nom de la boutique
  bio?: string;
  specialty?: string;
  phone: string;             // 8 chiffres
  workshopAddress: string;
  deliveryPrice: number;     // Prix de livraison en TND
  instagram?: string;
  facebook?: string;
  profileImage?: File;       // Image de profil
}
```

### DTOs de profil

#### UpdateProfileDto

```typescript
interface UpdateProfileDto {
  name?: string;
  email?: string;
  location?: string;
}
```

#### ChangePasswordDto

```typescript
interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;       // Min 8 caractères
}
```

#### UserFilterDto

Filtres pour la recherche d'utilisateurs (admin).

```typescript
interface UserFilterDto {
  role?: 'admin' | 'client' | 'artisan';
  email?: string;
  name?: string;
  createdAtMin?: string;     // ISO 8601 date
  createdAtMax?: string;
}
```

---

## Craftsman

### Craftsman

Profil complet d'un artisan.

```typescript
interface Craftsman {
  userId: string;            // Référence à User.id
  businessName: string;
  bio: string;
  specialty: string;
  phone: string;
  workshopAddress: string;
  instagram?: string;
  facebook?: string;
  expirationDate: string | null;  // Date d'expiration abonnement
  deliveryPrice: string;     // Prix de livraison
  profileImage: string | null;
  avgRating: number;         // Note moyenne (0-5)
  totalComments: number;     // Nombre total de commentaires
}
```

**Règles métier** :
- `expirationDate` : Si null, l'artisan est suspendu
- `avgRating` : Calculé automatiquement depuis les commentaires produits
- `phone` : Format tunisien (8 chiffres)

### CraftsmenResponse

Réponse paginée pour la liste d'artisans.

```typescript
interface CraftsmenResponse {
  items: Craftsman[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
```

---

## Product

### Product

Représente un produit artisanal.

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;             // Prix en TND
  stock: number;
  category: { 
    id: string; 
    name: string; 
  } | null;
  images: string[] | null;   // URLs des images
  craftsman: {
    userId: string;
    businessName: string;
    workshopAddress: string;
    profileImage: string | null;
    avgRating: number;
    totalComments: number;
  };
  offer: { 
    percentage: number;      // Pourcentage de réduction (0-100)
  } | null;
  avgRating: number;         // Note moyenne du produit
  totalComments: number;
  comments: ProductComment[] | null;
}
```

**Règles métier** :
- `images` : Maximum 5 images par produit
- `offer` : Si présent, le prix affiché est `price * (1 - percentage/100)`
- `avgRating` : Calculé depuis les commentaires

### ProductsResponse

```typescript
interface ProductsResponse {
  items: Product[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
```

### DTOs Produit

#### CreateProductDto

```typescript
interface CreateProductDto {
  name: string;
  description: string;
  price: number;             // > 0
  stock: number;             // >= 0
  categoryId?: string;
  images?: File[];           // Max 5 images, 1MB chacune
}
```

#### UpdateProductDto

```typescript
interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string | null;  // null pour supprimer la catégorie
  images?: File[];           // Nouvelles images à ajouter
  imagesToKeep?: string[];   // URLs des images existantes à conserver
}
```

#### ProductFilters

Filtres pour la recherche de produits.

```typescript
interface ProductFilters {
  productName?: string;      // Recherche dans le nom
  craftsmanName?: string;    // Recherche par nom d'artisan
  categoryIds?: string[];    // Filtrer par catégories
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;        // Note minimale (0-5)
  freeShipping?: boolean;    // Livraison gratuite (deliveryPrice = 0)
  sortByPrice?: 'asc' | 'desc';
  craftsmanId?: string;      // Filtrer par artisan
}
```

---

## Order

### Order

Représente une commande.

```typescript
interface Order {
  id: string;
  userId: string;
  status: OrderStatusRequest;
  createdAt: string;
  cin: string;               // CIN du client (8 chiffres)
  location: string;          // Adresse de livraison
  state: TunisianState;      // Gouvernorat tunisien
  phone: string;             // Téléphone (8 chiffres)
  deliveryPrice: string;     // Prix de livraison (Decimal)
  items: OrderItem[];
  user: {
    email: string;
    name: string;
  };
}
```

### OrderItem

Item dans une commande.

```typescript
interface OrderItem {
  productId: string;
  orderId: string;
  quantity: number;
  priceAtOrder: string;      // Prix au moment de la commande (Decimal)
  product: Product;
}
```

### Réponses Commandes

#### MyOrdersResponse

Commandes d'un client avec informations artisan.

```typescript
interface MyOrdersResponse {
  items: {
    order: Order;
    craftsman: Craftsman;
  }[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
```

#### OrdersResponse

Liste simple de commandes (pour artisans).

```typescript
interface OrdersResponse {
  items: Order[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: string;
    totalPages: number;
    currentPage: string;
  };
}
```

### DTOs Commande

#### CreateOrderDto

```typescript
interface CreateOrderDto {
  cin: string;               // 8 chiffres
  location: string;
  state: TunisianState;
  phone: string;             // 8 chiffres
}
```

**Validation** :
- `cin` : Exactement 8 chiffres
- `phone` : Exactement 8 chiffres
- `state` : Doit être un gouvernorat tunisien valide

---

## Shopping Cart

### ShoppingCartItem

Item dans le panier d'un utilisateur.

```typescript
interface ShoppingCartItem {
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  product: Product;
}
```

### CraftsmanGroup

Groupe de produits du même artisan dans le panier.

```typescript
interface CraftsmanGroup {
  craftsman: {
    id: string;
    businessName: string;
    deliveryPrice: number;
    phone: string;
    workshopAddress: string;
  };
  items: ShoppingCartItem[];
  subtotal: number;          // Total sans livraison
  deliveryPrice: number;
  total: number;             // Subtotal + deliveryPrice
}
```

### GroupedCartResponse

Panier groupé par artisan.

```typescript
interface GroupedCartResponse {
  craftsmanGroups: CraftsmanGroup[];
  grandTotal: number;        // Somme de tous les totaux
  totalItems: number;        // Nombre total d'items
}
```

### DTOs Panier

#### AddToCartDto

```typescript
interface AddToCartDto {
  productId: string;
  quantity?: number;         // Default: 1
}
```

#### UpdateCartDto

```typescript
interface UpdateCartDto {
  quantity: number;          // 0 pour supprimer l'item
}
```

---

## Category

### Category

Catégorie de produits.

```typescript
interface Category {
  id: string;
  name: string;
}
```

### CategoriesResponse

```typescript
interface CategoriesResponse {
  items: Category[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
```

---

## Comment

### ProductComment

Commentaire/avis sur un produit.

```typescript
interface ProductComment {
  id: string;
  content: string;
  mark: number;              // Note de 1 à 5
  userId: string;
  productId: string;
  createdAt: string;
  user: User;
}
```

### createCommentDto

```typescript
interface createCommentDto {
  productId: string;
  content: string;
  mark: number;              // 1-5
}
```

**Validation** :
- `mark` : Entre 1 et 5 inclus
- `content` : Non vide

---

## Offer

### Offer

Offre/promotion sur un produit.

```typescript
interface Offer {
  id: string;
  percentage: number;        // 0-100
  startDate: string;         // ISO 8601 date
  endDate: string;           // ISO 8601 date
}
```

**Règles métier** :
- `percentage` : Entre 0 et 100
- L'offre est active si date courante entre startDate et endDate
- Prix affiché : `product.price * (1 - offer.percentage / 100)`

---

## Enums

### OrderStatusRequest

Statuts possibles d'une commande.

```typescript
enum OrderStatusRequest {
  PENDING = 'PENDING',       // En attente
  CONFIRMED = 'CONFIRMED',   // Confirmée par l'artisan
  SHIPPED = 'SHIPPED',       // Expédiée
  DELIVERED = 'DELIVERED',   // Livrée
  CANCELLED = 'CANCELLED'    // Annulée
}
```

**Transitions autorisées** :
- PENDING → CONFIRMED, CANCELLED
- CONFIRMED → SHIPPED, CANCELLED
- SHIPPED → DELIVERED
- DELIVERED → (final)
- CANCELLED → (final)

### TunisianState

Gouvernorats tunisiens.

```typescript
enum TunisianState {
  TUNIS = 'TUNIS',
  ARIANA = 'ARIANA',
  BEN_AROUS = 'BEN_AROUS',
  MANOUBA = 'MANOUBA',
  NABEUL = 'NABEUL',
  ZAGHOUAN = 'ZAGHOUAN',
  BIZERTE = 'BIZERTE',
  BEJA = 'BEJA',
  JENDOUBA = 'JENDOUBA',
  LE_KAIRAOUAN = 'LE_KAIRAOUAN',
  KASSERINE = 'KASSERINE',
  SFAX = 'SFAX',
  SIDI_BOUZID = 'SIDI_BOUZID',
  SOUSSE = 'SOUSSE',
  MONASTIR = 'MONASTIR',
  MAHDIA = 'MAHDIA',
  GABES = 'GABES',
  MEDENINE = 'MEDENINE',
  TATAOUINE = 'TATAOUINE',
  TOZEUR = 'TOZEUR',
  KEBILI = 'KEBILI'
}
```

---

## Relations entre modèles

### Diagramme de relations

```
User (1) ──< (N) Order
User (1) ──< (N) ShoppingCartItem
User (1) ──< (N) ProductComment
User (1) ──── (1) Craftsman (si role = 'artisan')

Craftsman (1) ──< (N) Product
Product (N) ──> (1) Category
Product (1) ──< (N) ProductComment
Product (1) ──< (1) Offer
Product (1) ──< (N) OrderItem
Product (1) ──< (N) ShoppingCartItem

Order (1) ──< (N) OrderItem
Order (N) ──> (1) User
Order (N) ──> (1) Craftsman
```

---

## Règles de validation globales

### Champs communs

- **ID** : UUID v4
- **Dates** : Format ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
- **Prix** : Nombres décimaux positifs avec 2 décimales max
- **Email** : Format email valide
- **Téléphone** : 8 chiffres (format tunisien)
- **CIN** : 8 chiffres

### Images

- **Format** : PNG, JPG, JPEG
- **Taille max** : 1 MB par image
- **Nombre max** : 5 images par produit

### Mots de passe

- **Longueur min** : 8 caractères
- **Recommandation** : Mélange de lettres, chiffres et caractères spéciaux

---

## Exemples d'utilisation

### Création d'un produit avec images

```typescript
const productData: CreateProductDto = {
  name: "Vase artisanal",
  description: "Magnifique vase en céramique fait main",
  price: 45.99,
  stock: 10,
  categoryId: "cat-ceramique-123",
  images: [imageFile1, imageFile2, imageFile3] // File objects
};

productService.addProduct(productData).subscribe(
  product => console.log('Produit créé:', product)
);
```

### Création d'une commande

```typescript
const orderData: CreateOrderDto = {
  cin: "12345678",
  location: "123 Avenue Bourguiba, Tunis",
  state: TunisianState.TUNIS,
  phone: "98765432"
};

orderService.checkoutAllCraftsmen(orderData).subscribe(
  orders => console.log('Commandes créées:', orders)
);
```

### Filtrage de produits

```typescript
const filters: ProductFilters = {
  productName: "vase",
  categoryIds: ["cat-1", "cat-2"],
  minPrice: 10,
  maxPrice: 100,
  minRating: 4,
  sortByPrice: "asc",
  freeShipping: true
};

productService.getProducts(1, 20, filters).subscribe(
  response => console.log('Produits:', response.items)
);
```

---

## Notes importantes

1. **Décimaux** : Les prix sont stockés en string côté backend mais manipulés en number côté frontend
2. **Dates** : Toujours en UTC, conversion en local pour l'affichage
3. **Null vs Undefined** : `null` indique absence explicite, `undefined` signifie champ optionnel
4. **Cascade** : La suppression d'un user supprime ses commandes, commentaires, etc.
5. **Performance** : Utilisez la pagination pour les grandes listes
