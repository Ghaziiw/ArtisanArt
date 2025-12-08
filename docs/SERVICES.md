# API et Services - ArtisanArt

## Vue d'ensemble

Tous les services Angular communiquent avec le backend via HTTP. Chaque service encapsule la logique d'interaction avec une ressource spécifique.

**Base URL**: `http://localhost:3000`

## AuthService

Service de gestion de l'authentification et des sessions.

### Propriétés

```typescript
user$: Observable<User | null>      // Observable de l'utilisateur connecté
session$: Observable<Session | null> // Observable de la session active
currentUser: User | null            // Getter pour l'utilisateur actuel
```

### Méthodes

#### `getSession(): Observable<SessionResponse | null>`
Récupère la session actuelle depuis l'API.

```typescript
this.authService.getSession().subscribe(response => {
  if (response?.user) {
    console.log('User connected:', response.user);
  }
});
```

**Endpoint**: `GET /api/auth/get-session`  
**Credentials**: Required

#### `login(email: string, password: string): Promise<any>`
Connecte un utilisateur.

```typescript
const result = await this.authService.login(
  'user@example.com',
  'password123'
);

if ('user' in result) {
  // Succès
  this.router.navigate(['/profile']);
} else {
  // Erreur
  console.error(result.error);
}
```

**Utilise**: Better Auth Client

#### `logout(): Promise<void>`
Déconnecte l'utilisateur actuel.

```typescript
await this.authService.logout();
this.router.navigate(['/']);
```

#### `signUpClient(data: ClientSignUpDto): Observable<ClientSignUpResponse>`
Inscrit un nouveau client.

```typescript
const clientData: ClientSignUpDto = {
  email: 'client@example.com',
  password: 'SecurePass123',
  name: 'John Doe',
  location: 'Paris, France'
};

this.authService.signUpClient(clientData).subscribe({
  next: (response) => {
    console.log('Client created:', response);
  },
  error: (err) => {
    console.error('Error:', err.error?.message);
  }
});
```

**Endpoint**: `POST /api/auth/sign-up/email`  
**Credentials**: Required

#### `signUpCraftsman(data: CraftsmanSignUpDto): Observable<CraftsmanSignUpResponse>`
Inscrit un nouvel artisan.

```typescript
const craftsmanData: CraftsmanSignUpDto = {
  email: 'artisan@example.com',
  password: 'SecurePass123',
  name: 'Jane Smith',
  businessName: 'Atelier Ceramique',
  phone: '12345678',
  workshopAddress: '123 Rue de l\'Art, Paris',
  deliveryPrice: 5.99,
  bio: 'Artisan céramiste depuis 10 ans',
  specialty: 'Céramique artisanale',
  profileImage: imageFile // File object
};

this.authService.signUpCraftsman(craftsmanData).subscribe({
  next: (response) => {
    console.log('Craftsman created:', response);
  }
});
```

**Endpoint**: `POST /craftsmen`  
**Content-Type**: `multipart/form-data`  
**Credentials**: Required

---

## UserService

Gestion des utilisateurs et profils.

### Méthodes

#### `getAllUsers(filter?: UserFilterDto, page: number = 1, limit: number = 100): Observable<UserResponse>`
Liste tous les utilisateurs (Admin).

```typescript
const filter: UserFilterDto = {
  role: 'client',
  email: 'john',
  createdAtMin: '2024-01-01'
};

this.userService.getAllUsers(filter, 1, 20).subscribe(response => {
  console.log('Users:', response.items);
  console.log('Total:', response.meta.totalItems);
});
```

**Endpoint**: `GET /users?page={page}&limit={limit}&role={role}...`  
**Credentials**: Required (Admin)

#### `updateProfile(data: UpdateProfileDto): Observable<ProfileUpdateResponse>`
Met à jour le profil utilisateur.

```typescript
const updates: UpdateProfileDto = {
  name: 'John Updated',
  email: 'new.email@example.com',
  location: 'Lyon, France'
};

this.userService.updateProfile(updates).subscribe({
  next: (updatedUser) => {
    console.log('Profile updated:', updatedUser);
  }
});
```

**Endpoint**: `PATCH /users/profile/me`  
**Credentials**: Required

#### `updateProfileImage(imageFile: File): Observable<ProfileUpdateResponse>`
Met à jour la photo de profil.

```typescript
const file = event.target.files[0];

this.userService.updateProfileImage(file).subscribe({
  next: (response) => {
    console.log('Image uploaded:', response.image);
  },
  error: (err) => {
    console.error('Upload failed:', err.error?.message);
  }
});
```

**Endpoint**: `PATCH /users/profile/me/image`  
**Content-Type**: `multipart/form-data`  
**Credentials**: Required

#### `deleteProfileImage(): Observable<ProfileUpdateResponse>`
Supprime la photo de profil.

```typescript
this.userService.deleteProfileImage().subscribe({
  next: () => {
    console.log('Image deleted');
  }
});
```

**Endpoint**: `DELETE /users/profile/me/image`  
**Credentials**: Required

#### `changePassword(data: ChangePasswordDto): Observable<{message: string}>`
Change le mot de passe.

```typescript
const passwordData: ChangePasswordDto = {
  currentPassword: 'OldPass123',
  newPassword: 'NewSecurePass123'
};

this.userService.changePassword(passwordData).subscribe({
  next: (response) => {
    alert(response.message);
  }
});
```

**Endpoint**: `PATCH /users/profile/password`  
**Credentials**: Required

#### `deleteUser(userId: string): Observable<any>`
Supprime un utilisateur (Admin).

```typescript
this.userService.deleteUser('user-id-123').subscribe({
  next: () => {
    console.log('User deleted');
  }
});
```

**Endpoint**: `DELETE /users/{userId}`  
**Credentials**: Required (Admin)

#### `deleteMyProfile(): Observable<any>`
Supprime son propre profil.

```typescript
if (confirm('Êtes-vous sûr ?')) {
  this.userService.deleteMyProfile().subscribe({
    next: () => {
      window.location.href = '/';
    }
  });
}
```

**Endpoint**: `DELETE /users/me`  
**Credentials**: Required

#### `addAdminUser(data: CreateAdminDto): Observable<any>`
Crée un compte administrateur (Admin).

```typescript
const adminData: CreateAdminDto = {
  email: 'admin@example.com',
  password: 'AdminPass123',
  name: 'Admin User',
  location: 'Paris'
};

this.userService.addAdminUser(adminData).subscribe({
  next: () => {
    console.log('Admin created');
  }
});
```

**Endpoint**: `POST /users/admin`  
**Credentials**: Required (Admin)

---

## ProductService

Gestion des produits.

### Méthodes

#### `getProducts(page: number = 1, limit: number = 20, filters?: ProductFilters): Observable<ProductsResponse>`
Liste des produits avec filtres.

```typescript
const filters: ProductFilters = {
  productName: 'vase',
  categoryIds: ['cat-1', 'cat-2'],
  minPrice: 10,
  maxPrice: 100,
  minRating: 4,
  sortByPrice: 'asc',
  freeShipping: true
};

this.productService.getProducts(1, 20, filters).subscribe(response => {
  console.log('Products:', response.items);
  console.log('Pages:', response.meta.totalPages);
});
```

**Endpoint**: `GET /products?page={page}&limit={limit}&name={name}&minPrice={min}...`

#### `getProductById(productId: string): Observable<Product>`
Détails d'un produit.

```typescript
this.productService.getProductById('prod-123').subscribe(product => {
  console.log('Product:', product.name);
  console.log('Price:', product.price);
  console.log('Comments:', product.comments);
});
```

**Endpoint**: `GET /products/{productId}`

#### `addProduct(productData: CreateProductDto): Observable<Product>`
Créer un produit (Artisan).

```typescript
const productData: CreateProductDto = {
  name: 'Vase artisanal',
  description: 'Magnifique vase fait main',
  price: 49.99,
  stock: 10,
  categoryId: 'cat-ceramique',
  images: [imageFile1, imageFile2] // File[]
};

this.productService.addProduct(productData).subscribe({
  next: (product) => {
    console.log('Product created:', product.id);
  }
});
```

**Endpoint**: `POST /products`  
**Content-Type**: `multipart/form-data`  
**Credentials**: Required (Artisan)

#### `updateProduct(id: string, data: UpdateProductDto): Observable<Product>`
Modifier un produit (Artisan).

```typescript
const updates: UpdateProductDto = {
  name: 'Vase artisanal modifié',
  price: 59.99,
  stock: 8,
  categoryId: 'cat-ceramique',
  imagesToKeep: ['url1', 'url2'], // URLs des images à garder
  images: [newImageFile] // Nouvelles images
};

this.productService.updateProduct('prod-123', updates).subscribe({
  next: (updated) => {
    console.log('Product updated:', updated);
  }
});
```

**Endpoint**: `PATCH /products/{id}`  
**Content-Type**: `multipart/form-data`  
**Credentials**: Required (Artisan)

#### `deleteProduct(productId: string): Observable<void>`
Supprimer un produit (Artisan).

```typescript
if (confirm('Supprimer ce produit ?')) {
  this.productService.deleteProduct('prod-123').subscribe({
    next: () => {
      console.log('Product deleted');
    }
  });
}
```

**Endpoint**: `DELETE /products/{productId}`  
**Credentials**: Required (Artisan)

#### `getCraftsmanProducts(page: number, limit: number, craftsmanId?: string): Observable<ProductsResponse>`
Produits d'un artisan.

```typescript
this.productService.getCraftsmanProducts(1, 50, 'craftsman-123')
  .subscribe(response => {
    console.log('Products:', response.items);
  });
```

**Endpoint**: `GET /products?page={page}&limit={limit}&craftsmanId={id}`  
**Credentials**: Required (Artisan)

---

## ShoppingCartService

Gestion du panier d'achat.

### Méthodes

#### `addToCart(data: AddToCartDto): Observable<ShoppingCartResponse>`
Ajouter au panier.

```typescript
const cartData: AddToCartDto = {
  productId: 'prod-123',
  quantity: 2
};

this.cartService.addToCart(cartData).subscribe({
  next: (response) => {
    console.log('Added to cart:', response);
  },
  error: (err) => {
    console.error('Error:', err.error?.message);
  }
});
```

**Endpoint**: `POST /shoppingcarts`  
**Credentials**: Required

#### `getGroupedCart(): Observable<GroupedCartResponse>`
Panier groupé par artisan.

```typescript
this.cartService.getGroupedCart().subscribe(cart => {
  console.log('Total items:', cart.totalItems);
  console.log('Grand total:', cart.grandTotal);
  
  cart.craftsmanGroups.forEach(group => {
    console.log('Craftsman:', group.craftsman.businessName);
    console.log('Items:', group.items.length);
    console.log('Total:', group.total);
  });
});
```

**Endpoint**: `GET /shoppingcarts/craftsman-grouped`  
**Credentials**: Required

#### `updateCartItem(productId: string, quantity: number): Observable<ShoppingCartItem | {message: string}>`
Modifier la quantité.

```typescript
this.cartService.updateCartItem('prod-123', 5).subscribe({
  next: (response) => {
    if ('message' in response) {
      console.log(response.message); // Item removed
    } else {
      console.log('Updated:', response.quantity);
    }
  }
});
```

**Endpoint**: `PATCH /shoppingcarts/{productId}`  
**Body**: `{quantity: number}`  
**Credentials**: Required

#### `removeFromCart(productId: string): Observable<{message: string}>`
Retirer du panier.

```typescript
this.cartService.removeFromCart('prod-123').subscribe({
  next: (response) => {
    console.log(response.message);
  }
});
```

**Endpoint**: `PATCH /shoppingcarts/{productId}`  
**Body**: `{quantity: 0}`  
**Credentials**: Required

---

## OrderService

Gestion des commandes.

### Méthodes

#### `checkoutAllCraftsmen(orderData: CreateOrderDto): Observable<any>`
Commander tout le panier.

```typescript
const orderData: CreateOrderDto = {
  cin: '12345678',
  location: '123 Rue de Paris',
  state: TunisianState.TUNIS,
  phone: '12345678'
};

this.orderService.checkoutAllCraftsmen(orderData).subscribe({
  next: (orders) => {
    console.log('Orders created:', orders);
    this.router.navigate(['/orders']);
  }
});
```

**Endpoint**: `POST /orders/checkout`  
**Credentials**: Required

#### `checkoutSingleCraftsman(craftsmanId: string, orderData: CreateOrderDto): Observable<any>`
Commander chez un artisan.

```typescript
this.orderService.checkoutSingleCraftsman('craftsman-123', orderData)
  .subscribe({
    next: (order) => {
      console.log('Order created:', order);
    }
  });
```

**Endpoint**: `POST /orders/checkout/{craftsmanId}`  
**Credentials**: Required

#### `getMyOrders(page: number = 1, limit: number = 10): Observable<MyOrdersResponse>`
Mes commandes (Client).

```typescript
this.orderService.getMyOrders(1, 10).subscribe(response => {
  response.items.forEach(item => {
    console.log('Order:', item.order.id);
    console.log('Status:', item.order.status);
    console.log('Craftsman:', item.craftsman.businessName);
  });
});
```

**Endpoint**: `GET /orders?page={page}&limit={limit}`  
**Credentials**: Required

#### `getCraftsmanOrders(page: number = 1, limit: number = 100): Observable<OrdersResponse>`
Commandes reçues (Artisan).

```typescript
this.orderService.getCraftsmanOrders(1, 50).subscribe(response => {
  console.log('Orders received:', response.items);
});
```

**Endpoint**: `GET /orders/craftsman?page={page}&limit={limit}`  
**Credentials**: Required (Artisan)

#### `updateOrderStatus(orderId: string, status: OrderStatusRequest): Observable<Order>`
Mettre à jour le statut.

```typescript
this.orderService.updateOrderStatus(
  'order-123',
  OrderStatusRequest.SHIPPED
).subscribe({
  next: (order) => {
    console.log('Order updated:', order.status);
  }
});
```

**Endpoint**: `PATCH /orders/{orderId}/status`  
**Body**: `{status: string}`  
**Credentials**: Required

#### `cancelOrder(orderId: string): Observable<Order>`
Annuler une commande (status PENDING uniquement).

```typescript
this.orderService.cancelOrder('order-123').subscribe({
  next: (order) => {
    console.log('Order cancelled:', order.id);
  }
});
```

**Endpoint**: `PATCH /orders/{orderId}/status`  
**Body**: `{status: 'CANCELLED'}`  
**Credentials**: Required

---

## CraftsmanService

Gestion des profils artisans.

### Méthodes

#### `getCraftsmanById(craftsmanId: string): Observable<Craftsman>`
Détails d'un artisan.

```typescript
this.craftsmanService.getCraftsmanById('craftsman-123')
  .subscribe(craftsman => {
    console.log('Business:', craftsman.businessName);
    console.log('Rating:', craftsman.avgRating);
  });
```

**Endpoint**: `GET /craftsmen/{craftsmanId}`

#### `getMyProfile(): Observable<Craftsman>`
Mon profil artisan.

```typescript
this.craftsmanService.getMyProfile().subscribe(profile => {
  console.log('My business:', profile.businessName);
});
```

**Endpoint**: `GET /craftsmen/profile/me`  
**Credentials**: Required (Artisan)

#### `getAllCraftsmen(): Observable<CraftsmenResponse>`
Liste tous les artisans.

```typescript
this.craftsmanService.getAllCraftsmen().subscribe(response => {
  console.log('Craftsmen:', response.items);
});
```

**Endpoint**: `GET /craftsmen`

#### `updateExpirationDate(craftsmanId: string, newExpDate: string | null): Observable<any>`
Mettre à jour l'expiration (Admin).

```typescript
this.craftsmanService.updateExpirationDate(
  'craftsman-123',
  '2025-12-31'
).subscribe({
  next: () => {
    console.log('Expiration updated');
  }
});
```

**Endpoint**: `PATCH /craftsmen/{craftsmanId}/exp`  
**Body**: `{newExpDate: string | null}`  
**Credentials**: Required (Admin)

---

## CategoryService

Gestion des catégories.

### Méthodes

#### `getCategories(page: number = 1, limit: number = 20): Observable<CategoriesResponse>`
Liste des catégories.

```typescript
this.categoryService.getCategories(1, 50).subscribe(response => {
  console.log('Categories:', response.items);
});
```

**Endpoint**: `GET /categories?page={page}&limit={limit}`

#### `createCategory(name: string): Observable<Category>`
Créer une catégorie (Admin).

```typescript
this.categoryService.createCategory('Poterie').subscribe({
  next: (category) => {
    console.log('Category created:', category);
  }
});
```

**Endpoint**: `POST /categories`  
**Body**: `{name: string}`  
**Credentials**: Required (Admin)

#### `deleteCategory(categoryId: string): Observable<void>`
Supprimer une catégorie (Admin).

```typescript
this.categoryService.deleteCategory('cat-123').subscribe({
  next: () => {
    console.log('Category deleted');
  }
});
```

**Endpoint**: `DELETE /categories/{categoryId}`  
**Credentials**: Required (Admin)

---

## CommentService

Gestion des commentaires.

### Méthodes

#### `getComments(productId: string, page: number = 1, limit: number = 20): Observable<CommentsResponse>`
Commentaires d'un produit.

```typescript
this.commentService.getComments('prod-123', 1, 20)
  .subscribe(response => {
    console.log('Comments:', response.items);
  });
```

**Endpoint**: `GET /comments/{productId}?page={page}&limit={limit}`

#### `addComment(commentData: createCommentDto): Observable<ProductComment>`
Ajouter un commentaire.

```typescript
const comment: createCommentDto = {
  productId: 'prod-123',
  content: 'Excellent produit !',
  mark: 5
};

this.commentService.addComment(comment).subscribe({
  next: (newComment) => {
    console.log('Comment added:', newComment);
  }
});
```

**Endpoint**: `POST /comments`  
**Body**: `{productId, content, mark}`  
**Credentials**: Required

---

## FilterService

Service de gestion des filtres de recherche (local).

### Propriétés

```typescript
viewType$: Observable<'products' | 'artisans'>
searchQuery$: Observable<string>
```

### Méthodes

#### `setViewType(type: 'products' | 'artisans'): void`
Définir le type de vue.

```typescript
this.filterService.setViewType('artisans');
```

#### `setSearchQuery(query: string): void`
Définir la requête de recherche.

```typescript
this.filterService.setSearchQuery('vase céramique');
```

#### `getCurrentViewType(): 'products' | 'artisans'`
Obtenir le type de vue actuel.

```typescript
const currentView = this.filterService.getCurrentViewType();
```

#### `getCurrentSearchQuery(): string`
Obtenir la requête actuelle.

```typescript
const query = this.filterService.getCurrentSearchQuery();
```

---

## OfferService

Gestion des offres/promotions.

### Méthodes

#### `getOffer(productId: string): Observable<Offer>`
Récupérer l'offre d'un produit.

```typescript
this.offerService.getOffer('prod-123').subscribe(offer => {
  console.log('Discount:', offer.percentage + '%');
  console.log('Valid until:', offer.endDate);
});
```

**Endpoint**: `GET /offers/{productId}`

---

## Gestion des erreurs

Tous les services suivent le même pattern de gestion d'erreurs :

```typescript
this.service.method().subscribe({
  next: (response) => {
    // Traitement succès
  },
  error: (err) => {
    console.error('Error:', err);
    const message = err.error?.message || 'Une erreur est survenue';
    // Afficher le message à l'utilisateur
  }
});
```

### Codes d'erreur HTTP courants

- **400** : Bad Request (données invalides)
- **401** : Unauthorized (non authentifié)
- **403** : Forbidden (pas les permissions)
- **404** : Not Found (ressource introuvable)
- **500** : Internal Server Error (erreur serveur)

---

Pour plus d'informations, consultez :
- [Modèles de données](DATA_MODELS.md)
- [Guide de développement](DEVELOPMENT.md)