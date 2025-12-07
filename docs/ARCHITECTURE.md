# Architecture du projet ArtisanArt

## Vue d'ensemble de l'architecture

ArtisanArt suit une architecture modulaire basée sur les principes Angular, avec une séparation claire des responsabilités.

```
┌─────────────────────────────────────┐
│     Presentation Layer              │
│  (Components & Templates)           │
├─────────────────────────────────────┤
│     Business Logic Layer            │
│   (Services & State Management)     │
├─────────────────────────────────────┤
│     Data Access Layer               │
│   (HTTP Services & API Calls)       │
├─────────────────────────────────────┤
│     Backend API                     │
│   (Express Server)                  │
└─────────────────────────────────────┘
```

## Principes architecturaux

### 1. Separation of Concerns (SoC)
- **Components** : Gestion de l'UI et des interactions utilisateur
- **Services** : Logique métier et gestion d'état
- **Models** : Définition des structures de données

### 2. Standalone Components
Utilisation des composants standalone Angular pour :
- Réduire la complexité des modules
- Améliorer le tree-shaking
- Faciliter le lazy loading

### 3. Reactive Programming
- Utilisation intensive de RxJS pour la gestion d'état
- Observables pour la communication asynchrone
- BehaviorSubjects pour le state management

### 4. Lazy Loading
- Chargement différé des modules
- Amélioration des performances initiales
- Réduction du bundle size

## Structure détaillée des dossiers

```
src/app/
├── core/                           # Fonctionnalités essentielles
│   ├── models/                     # Interfaces TypeScript
│   │   ├── auth.model.ts          # Modèles d'authentification
│   │   ├── user.model.ts          # Modèles utilisateur
│   │   ├── product.model.ts       # Modèles produit
│   │   ├── order.model.ts         # Modèles commande
│   │   ├── craftsman.model.ts     # Modèles artisan
│   │   ├── category.model.ts      # Modèles catégorie
│   │   ├── comment.model.ts       # Modèles commentaire
│   │   ├── shopping-cart.model.ts # Modèles panier
│   │   └── index.ts               # Barrel export
│   │
│   └── services/                   # Services métier
│       ├── auth.service.ts         # Authentification
│       ├── user.service.ts         # Gestion utilisateurs
│       ├── product.service.ts      # Gestion produits
│       ├── order.service.ts        # Gestion commandes
│       ├── craftsman.service.ts    # Gestion artisans
│       ├── category.service.ts     # Gestion catégories
│       ├── comment.service.ts      # Gestion commentaires
│       ├── shopping-cart.service.ts# Gestion panier
│       ├── filter.service.ts       # Filtres de recherche
│       └── offer.service.ts        # Gestion offres
│
├── features/                       # Modules fonctionnels
│   ├── homepage/                   # Page d'accueil
│   │   ├── components/
│   │   │   ├── search-filters-bar/
│   │   │   ├── search-results-tab/
│   │   │   └── artisan-card/
│   │   ├── homepage.html
│   │   ├── homepage.css
│   │   └── homepage.ts
│   │
│   ├── login-sign-up/             # Authentification
│   │   └── components/
│   │       ├── login-page/
│   │       └── sign-up-page/
│   │
│   ├── profile/                   # Profil utilisateur
│   │   ├── profile-pic/
│   │   ├── personal-info/
│   │   ├── profile.html
│   │   └── profile.ts
│   │
│   ├── productpage/               # Détail produit
│   │   ├── components/
│   │   │   ├── product-info/
│   │   │   ├── craftsman-info/
│   │   │   └── reviews-container/
│   │   └── productpage/
│   │
│   ├── cart/                      # Panier
│   ├── orders-page/               # Commandes
│   ├── artisan-dashboard/         # Dashboard artisan
│   ├── artisan-profile/           # Profil artisan public
│   ├── admin-ctrl-page/           # Panel admin
│   └── [autres pages]/            # Pages informatives
│
├── shared/                        # Composants partagés
│   └── components/
│       ├── header/                # En-tête
│       └── footer/                # Pied de page
│
├── app.config.ts                  # Configuration app
├── app.config.server.ts           # Configuration SSR
├── app.routes.ts                  # Routes
├── app.routes.server.ts           # Routes SSR
└── app.ts                         # Composant racine
```

## Flux de données

### 1. Flux utilisateur typique

```
User Action (Component)
    ↓
Event Handler (Component)
    ↓
Service Method Call
    ↓
HTTP Request (Service)
    ↓
Backend API
    ↓
HTTP Response
    ↓
RxJS Observable
    ↓
Component Subscription
    ↓
UI Update (Template)
```

### 2. Gestion d'état avec Services

```typescript
// Service avec BehaviorSubject
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  updateUser(user: User) {
    this.userSubject.next(user);
  }
}

// Composant qui s'abonne
export class HeaderComponent {
  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      // Réagir aux changements
    });
  }
}
```

## Patterns utilisés

### 1. Service Pattern
Tous les appels API et la logique métier sont centralisés dans les services.

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}
  
  getProducts(filters: ProductFilters): Observable<ProductsResponse> {
    // Logique API
  }
}
```

### 2. Observer Pattern (RxJS)
Communication asynchrone entre composants via Observables.

```typescript
// Émission
this.userSubject.next(updatedUser);

// Souscription
this.authService.user$.pipe(
  filter(user => !!user),
  map(user => user.name)
).subscribe(name => console.log(name));
```

### 3. Dependency Injection
Injection automatique des dépendances par Angular.

```typescript
constructor(
  private authService: AuthService,
  private router: Router,
  private productService: ProductService
) {}
```

### 4. Template-Driven Forms
Utilisation de ngModel pour les formulaires simples.

```html
<form #myForm="ngForm" (ngSubmit)="onSubmit()">
  <input [(ngModel)]="user.name" name="name" required>
</form>
```

## Architecture de sécurité

### 1. Authentification
```
Client (Angular)
    ↓
Better Auth Client
    ↓
HTTP Request (with credentials)
    ↓
Backend API (Better Auth Server)
    ↓
Session/Token Validation
    ↓
Protected Resource
```

### 2. Gestion des rôles

```typescript
// Observable pour vérifier les rôles
isAdmin$ = this.authService.user$.pipe(
  map(user => user?.role === 'admin')
);

// Utilisation dans le template
<button *ngIf="isAdmin$ | async">Admin Panel</button>
```

### 3. Guards (Recommandé)

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.user$.pipe(
    map(user => {
      if (user) return true;
      return router.createUrlTree(['/login']);
    })
  );
};
```

## Communication Backend

### Configuration API

```typescript
// lib/auth-client.ts
export const BASE_URL = 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL: BASE_URL,
});
```

### Structure des requêtes

```typescript
// GET avec paramètres
getProducts(page: number, filters: ProductFilters) {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('limit', '20');
    
  if (filters.categoryIds) {
    filters.categoryIds.forEach(id => {
      params = params.append('categoriesId', id);
    });
  }
  
  return this.http.get<ProductsResponse>(
    `${this.apiUrl}/products`,
    { params }
  );
}

// POST avec FormData
addProduct(data: CreateProductDto) {
  const formData = new FormData();
  formData.append('name', data.name);
  
  if (data.images) {
    data.images.forEach(img => {
      formData.append('images', img);
    });
  }
  
  return this.http.post<Product>(
    `${this.apiUrl}/products`,
    formData,
    { withCredentials: true }
  );
}
```

## Architecture des composants

### Structure d'un composant type

```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard implements OnInit, OnDestroy {
  // Inputs/Outputs
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<void>();
  
  // State
  isLoading = false;
  
  // Lifecycle
  ngOnInit() {
    // Initialisation
  }
  
  ngOnDestroy() {
    // Cleanup
  }
  
  // Methods
  onAddToCart() {
    this.addToCart.emit();
  }
}
```

## Server-Side Rendering (SSR)

### Configuration

```typescript
// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

// app.routes.server.ts
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
```

### Considérations SSR

- Vérifier `typeof window !== 'undefined'` avant d'accéder au DOM
- Utiliser `isPlatformBrowser(platformId)` pour le code spécifique navigateur
- Éviter les références directes à `window`, `document`, `localStorage`

## Optimisations de performance

### 1. Lazy Loading
```typescript
{
  path: '',
  loadComponent: () => import('./features/homepage/homepage')
    .then(m => m.Homepage)
}
```

### 2. OnPush Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 3. TrackBy pour ngFor
```typescript
trackByProductId(index: number, product: Product) {
  return product.id;
}
```

```html
<div *ngFor="let product of products; trackBy: trackByProductId">
```

## Architecture de test

```
component.spec.ts    # Tests unitaires
service.spec.ts      # Tests de services
e2e/                 # Tests end-to-end
```

### Exemple de test

```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch products', () => {
    service.getProducts().subscribe(response => {
      expect(response.items.length).toBe(10);
    });

    const req = httpMock.expectOne(`${BASE_URL}/products`);
    expect(req.request.method).toBe('GET');
  });
});
```

## Conventions de code

### Nommage
- **Components** : PascalCase (ex: `ProductCard`)
- **Services** : PascalCase + Service (ex: `AuthService`)
- **Variables** : camelCase (ex: `productList`)
- **Constants** : UPPER_SNAKE_CASE (ex: `BASE_URL`)

### Organisation des imports
```typescript
// 1. Angular imports
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Third-party imports
import { Observable } from 'rxjs';

// 3. Local imports
import { Product } from '../../core/models';
import { ProductService } from '../../core/services';
```

---

Pour plus de détails sur l'implémentation, consultez :
- [Guide de développement](DEVELOPMENT.md)
- [API et Services](SERVICES.md)
- [Modèles de données](DATA_MODELS.md)