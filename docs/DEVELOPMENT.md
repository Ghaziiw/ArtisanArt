# Guide de développement - ArtisanArt

Ce guide vous accompagne dans le développement et la contribution au projet ArtisanArt.

## Table des matières

- [Setup environnement](#setup-environnement)
- [Structure du projet](#structure-du-projet)
- [Conventions de code](#conventions-de-code)
- [Workflow de développement](#workflow-de-développement)
- [Composants](#composants)
- [Services](#services)
- [State Management](#state-management)
- [Routing](#routing)
- [Formulaires](#formulaires)
- [Styling](#styling)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Optimisations](#optimisations)
- [Debugging](#debugging)
- [Best practices](#best-practices)

---

## Setup environnement

### Installation initiale

```bash
# Cloner le repository
git clone https://github.com/votre-username/artisanart.git
cd artisanart

# Installer les dépendances
npm install

# Installer Angular CLI globalement (si pas déjà fait)
npm install -g @angular/cli@19

# Vérifier l'installation
ng version
```

### Configuration IDE

#### VS Code (recommandé)

Extensions recommandées :

```json
{
  "recommendations": [
    "angular.ng-template",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "johnpapa.angular2",
    "christian-kohler.path-intellisense",
    "nrwl.angular-console"
  ]
}
```

Settings VS Code (`.vscode/settings.json`) :

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Structure du projet

### Organisation des fichiers

```
src/
├── app/
│   ├── core/                  # Singleton services & models
│   │   ├── models/           # TypeScript interfaces
│   │   └── services/         # Business logic services
│   ├── features/             # Feature modules (lazy loaded)
│   │   ├── homepage/
│   │   ├── profile/
│   │   └── ...
│   ├── shared/               # Shared components
│   │   └── components/
│   ├── app.config.ts         # App configuration
│   ├── app.routes.ts         # Route definitions
│   └── app.ts                # Root component
├── assets/                   # Static assets
│   ├── fonts/
│   └── images/
├── lib/                      # External integrations
│   └── auth-client.ts        # Better Auth client
└── styles.css                # Global styles
```

### Nomenclature des fichiers

- **Composants** : `component-name.ts`, `component-name.html`, `component-name.css`
- **Services** : `service-name.service.ts`
- **Models** : `model-name.model.ts`
- **Guards** : `guard-name.guard.ts`

---

## Conventions de code

### TypeScript

#### Naming conventions

```typescript
// Classes, Interfaces, Types - PascalCase
class UserService { }
interface ProductFilter { }
type OrderStatus = 'pending' | 'delivered';

// Variables, fonctions - camelCase
const userName = 'John';
function getUserById(id: string) { }

// Constantes - UPPER_SNAKE_CASE
const BASE_URL = 'http://localhost:3000';
const MAX_FILE_SIZE = 1024 * 1024;

// Privé - préfixe underscore (optionnel)
private _internalState = null;
```

#### Typage fort

```typescript
// ✅ Bon
function addProduct(product: CreateProductDto): Observable<Product> {
  return this.http.post<Product>(`${this.apiUrl}/products`, product);
}

// ❌ Éviter
function addProduct(product: any): any {
  return this.http.post(`${this.apiUrl}/products`, product);
}
```

#### Imports organisés

```typescript
// 1. Angular imports
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Third-party imports
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// 3. Local imports
import { Product } from '../../core/models';
import { ProductService } from '../../core/services';
```

### HTML

```html
<!-- ✅ Bon - Indentation cohérente, attributs bien organisés -->
<div class="product-card" 
     *ngIf="product" 
     (click)="onProductClick()"
     [class.selected]="isSelected">
  <h3>{{ product.name }}</h3>
  <p>{{ product.description }}</p>
</div>

<!-- ❌ Éviter - Difficile à lire -->
<div class="product-card" *ngIf="product" (click)="onProductClick()" [class.selected]="isSelected"><h3>{{ product.name }}</h3><p>{{ product.description }}</p></div>
```

### CSS

```css
/* ✅ Bon - Utilisation des variables CSS */
.button {
  background-color: var(--sign-up-btn);
  border-radius: var(--general-border-radius);
  padding: 10px 20px;
}

/* Classes BEM pour composants complexes */
.product-card { }
.product-card__title { }
.product-card__price--discount { }

/* ❌ Éviter - Valeurs en dur */
.button {
  background-color: #a74f4e;
  border-radius: 10px;
}
```

---

## Workflow de développement

### Branches Git

```bash
main           # Production
develop        # Développement
feature/xxx    # Nouvelles fonctionnalités
fix/xxx        # Corrections de bugs
hotfix/xxx     # Corrections urgentes
```

### Workflow typique

```bash
# 1. Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/add-wishlist

# 2. Développer et commiter
git add .
git commit -m "feat: add wishlist functionality"

# 3. Pousser et créer PR
git push origin feature/add-wishlist
# Créer une Pull Request sur GitHub
```

### Messages de commit

Format : `type(scope): message`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, style
- `refactor`: Refactoring de code
- `test`: Ajout de tests
- `chore`: Tâches diverses

```bash
feat(cart): add quantity selector
fix(auth): correct session timeout issue
docs(api): update service documentation
refactor(homepage): simplify product filter logic
```

---

## Composants

### Structure d'un composant

```typescript
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard implements OnInit, OnDestroy {
  // Inputs
  @Input() product!: Product;
  @Input() showActions = true;
  
  // Outputs
  @Output() productClick = new EventEmitter<Product>();
  
  // State
  isLoading = false;
  errorMessage = '';
  
  // Subject pour unsubscribe
  private destroy$ = new Subject<void>();
  
  constructor(
    private productService: ProductService
  ) {}
  
  ngOnInit(): void {
    this.loadProductData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadProductData(): void {
    this.productService.getProduct(this.product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          // Handle data
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
  }
  
  onProductClick(): void {
    this.productClick.emit(this.product);
  }
}
```

### Lifecycle Hooks

```typescript
export class MyComponent implements OnInit, OnChanges, OnDestroy {
  // OnChanges - Quand les @Input changent
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.updateProductDisplay();
    }
  }
  
  // OnInit - Initialisation du composant
  ngOnInit(): void {
    this.loadInitialData();
  }
  
  // OnDestroy - Nettoyage
  ngOnDestroy(): void {
    this.cleanup();
  }
}
```

---

## Services

### Structure d'un service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${BASE_URL}/products`;
  
  // State management
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  getProducts(filters?: ProductFilters): Observable<ProductsResponse> {
    let params = new HttpParams();
    
    if (filters?.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    
    return this.http.get<ProductsResponse>(this.apiUrl, { params }).pipe(
      tap(response => this.productsSubject.next(response.items)),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    throw error;
  }
}
```

### HttpClient Best Practices

```typescript
// ✅ Bon - Typage fort, gestion des paramètres
getProducts(page: number, limit: number): Observable<ProductsResponse> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
  
  return this.http.get<ProductsResponse>(this.apiUrl, { params });
}

// ✅ FormData pour les fichiers
uploadProduct(data: CreateProductDto): Observable<Product> {
  const formData = new FormData();
  formData.append('name', data.name);
  
  if (data.images) {
    data.images.forEach(img => formData.append('images', img));
  }
  
  return this.http.post<Product>(this.apiUrl, formData, {
    withCredentials: true
  });
}
```

---

## State Management

### BehaviorSubject Pattern

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  
  get currentUser(): User | null {
    return this.userSubject.value;
  }
  
  updateUser(user: User): void {
    this.userSubject.next(user);
  }
  
  clearUser(): void {
    this.userSubject.next(null);
  }
}
```

### Utilisation dans les composants

```typescript
export class HeaderComponent {
  isAdmin$: Observable<boolean>;
  
  constructor(private authService: AuthService) {
    this.isAdmin$ = this.authService.user$.pipe(
      map(user => user?.role === 'admin')
    );
  }
}
```

```html
<!-- Template -->
<button *ngIf="isAdmin$ | async">Admin Panel</button>
```

---

## Routing

### Configuration des routes

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/homepage/homepage')
      .then(m => m.Homepage)
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]  // Protection de route
  },
  {
    path: 'product-page/:id',
    component: Productpage
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

### Navigation programmatique

```typescript
export class MyComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  navigateToProduct(productId: string): void {
    this.router.navigate(['/product-page', productId]);
  }
  
  navigateWithQuery(): void {
    this.router.navigate(['/products'], {
      queryParams: { category: 'ceramique', minPrice: 10 }
    });
  }
  
  getRouteParams(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.loadProduct(id);
    });
  }
}
```

---

## Formulaires

### Template-driven forms

```typescript
export class LoginPage {
  credentials = { email: '', password: '' };
  
  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    
    this.authService.login(
      this.credentials.email,
      this.credentials.password
    );
  }
}
```

```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <input 
    type="email"
    [(ngModel)]="credentials.email"
    name="email"
    required
    email
    #emailInput="ngModel">
  
  <div *ngIf="emailInput.invalid && emailInput.touched">
    Email invalide
  </div>
  
  <button [disabled]="!loginForm.valid">Login</button>
</form>
```

### Validation personnalisée

```typescript
// Dans le composant
validatePassword(password: string): boolean {
  return password.length >= 8;
}

// Dans le template
<div *ngIf="!validatePassword(credentials.password)">
  Le mot de passe doit contenir au moins 8 caractères
</div>
```

---

## Styling

### Variables CSS globales

Définies dans `src/styles.css` :

```css
:root {
  --color-palette1: #9a2b1b;
  --login-btn-text: #5a4237;
  --login-btn-background: #f5e6df;
  --sign-up-btn: #a74f4e;
  --general-border-radius: 10px;
}
```

### Utilisation

```css
.my-button {
  background-color: var(--sign-up-btn);
  border-radius: var(--general-border-radius);
  color: var(--login-btn-text);
  
  transition: all 0.3s ease;
}

.my-button:hover {
  background-color: var(--sign-up-btn-on-hover);
}
```

### Responsive Design

```css
/* Mobile first */
.container {
  width: 100%;
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1200px) {
  .container {
    width: 1200px;
  }
}
```

---

## Gestion des erreurs

### Service level

```typescript
private handleError(error: HttpErrorResponse): Observable<never> {
  let errorMessage = '';
  
  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = `Error: ${error.error.message}`;
  } else {
    // Server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  
  console.error(errorMessage);
  return throwError(() => new Error(errorMessage));
}
```

### Component level

```typescript
export class MyComponent {
  errorMessage = '';
  
  loadData(): void {
    this.service.getData().subscribe({
      next: (data) => {
        // Success
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred';
        
        // Clear after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }
}
```

---

## Optimisations

### Change Detection Strategy

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent { }
```

### TrackBy for *ngFor

```typescript
export class MyComponent {
  products: Product[] = [];
  
  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
```

```html
<div *ngFor="let product of products; trackBy: trackByProductId">
  {{ product.name }}
</div>
```

### Lazy Loading

Déjà configuré pour toutes les features. Exemple :

```typescript
{
  path: 'orders',
  loadComponent: () => import('./features/orders-page/orders-page')
    .then(m => m.OrdersPage)
}
```

---

## Debugging

### Angular DevTools

Installer l'extension Chrome "Angular DevTools" pour :
- Inspecter la hiérarchie des composants
- Voir les propriétés et méthodes
- Profiler les performances

### Console Logging

```typescript
// ✅ Bon - Informatif
console.log('User loaded:', user);
console.error('Failed to load products:', error);

// ❌ Éviter en production
console.log('test');
console.log(user);
```

### Debugging RxJS

```typescript
this.productService.getProducts().pipe(
  tap(data => console.log('Received data:', data)),
  map(response => response.items),
  tap(items => console.log('Mapped items:', items))
).subscribe();
```

---

## Best Practices

### Do's ✅

- **Utiliser les Observables** pour la gestion asynchrone
- **Unsubscribe** dans ngOnDestroy avec `takeUntil`
- **Typer fortement** toutes les variables et fonctions
- **Composants petits** et réutilisables
- **Services pour la logique** métier
- **Variables CSS** pour la cohérence visuelle
- **Lazy loading** pour les performances
- **Gestion d'erreurs** complète
- **Tests** pour les fonctionnalités critiques

### Don'ts ❌

- **Éviter `any`** - toujours typer
- **Pas de logique** dans les templates
- **Pas de DOM manipulation** directe
- **Éviter les subscriptions** multiples non nécessaires
- **Pas de code dupliqué** - créer des composants/services partagés
- **Éviter les styles inline** dans les templates

### Performance

```typescript
// ✅ Bon - Une seule subscription
this.authService.user$.pipe(
  map(user => user?.role === 'admin')
).subscribe(isAdmin => this.isAdmin = isAdmin);

// ❌ Éviter - Subscriptions multiples
this.authService.user$.subscribe(user => {
  this.authService.user$.subscribe(u => {
    // Nested subscription
  });
});
```

---

## Ressources utiles

### Documentation

- [Angular Official Docs](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools

- [Angular CLI](https://angular.io/cli)
- [Augury DevTools](https://augury.rangle.io/)
- [Angular Language Service](https://angular.io/guide/language-service)
