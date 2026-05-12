# Documentation du Routing - ArtisanArt

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Configuration du routing](#configuration-du-routing)
3. [Routes disponibles](#routes-disponibles)
4. [Guards et protection des routes](#guards-et-protection-des-routes)
5. [Navigation programmatique](#navigation-programmatique)
6. [Paramètres de route](#paramètres-de-route)

---

## Vue d'ensemble

ArtisanArt utilise le système de routing d'Angular pour gérer la navigation entre les différentes pages de l'application. Le routing est configuré dans `src/app/app.routes.ts` avec lazy loading pour optimiser les performances.

### Technologies utilisées
- **Angular Router** (v19.1.5)
- **Lazy Loading** pour la page d'accueil
- **Route Parameters** pour les pages dynamiques

---

## Configuration du routing

### Fichier principal : `app.routes.ts`

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/homepage/homepage')
      .then((m) => m.Homepage),
  },
  // ... autres routes
  {
    path: '**',
    redirectTo: '',
  },
];
```

### Configuration SSR : `app.routes.server.ts`

```typescript
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
```

Toutes les routes sont pré-rendues côté serveur pour améliorer les performances et le SEO.

---

## Routes disponibles

### Routes publiques (accessibles sans authentification)

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | Homepage | Page d'accueil avec recherche produits/artisans |
| `/login` | LoginPage | Page de connexion |
| `/signup` | SignUpPage | Page d'inscription (client/artisan) |
| `/product-page/:id` | Productpage | Détails d'un produit |
| `/artisan-profile/:id` | ArtisanProfile | Profil public d'un artisan |
| `/about` | AboutPage | À propos d'ArtisanArt |
| `/how-it-works` | HowItWorks | Comment utiliser la plateforme |
| `/faq` | Faq | Questions fréquentes |
| `/terms-of-use` | TermsOfUse | Conditions d'utilisation |
| `/privacy-policy` | PrivacyPolicy | Politique de confidentialité |

### Routes authentifiées (nécessitent une connexion)

| Route | Composant | Rôle requis | Description |
|-------|-----------|-------------|-------------|
| `/profile` | Profile | Tous | Profil de l'utilisateur |
| `/cart` | Cart | Client/Artisan | Panier d'achat |
| `/orders` | OrdersPage | Client/Artisan | Historique des commandes |
| `/my-store` | MyStore | Artisan | Tableau de bord artisan |
| `/admin-panel` | AdminCtrlPage | Admin | Panel d'administration |

### Routes avec paramètres

```typescript
// Profil artisan
{
  path: 'artisan-profile/:id',
  component: ArtisanProfile,
}

// Page produit
{
  path: 'product-page/:id',
  component: Productpage,
}
```

**Utilisation des paramètres :**

```typescript
// Dans le composant
this.route.paramMap.subscribe(params => {
  const id = params.get('id');
  // Charger les données avec cet ID
});
```

---

## Guards et protection des routes

Actuellement, l'application n'utilise pas de guards Angular explicites. La protection des routes se fait via :

### 1. Vérification dans les composants

```typescript
// Exemple dans Header
isAdmin$ = this.authService.user$.pipe(
  map(user => user?.role === 'admin')
);
```

### 2. Affichage conditionnel dans le template

```html
<!-- Afficher uniquement pour les admins -->
<button *ngIf="isAdmin$ | async" routerLink="/admin-panel">
  Admin Panel
</button>
```

### Recommandations pour améliorer la sécurité

**1. Créer des guards :**

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.user$.pipe(
    map(user => {
      if (user) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};

// role.guard.ts
export const roleGuard = (allowedRole: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    return authService.user$.pipe(
      map(user => {
        if (user?.role === allowedRole) return true;
        router.navigate(['/']);
        return false;
      })
    );
  };
};
```

**2. Application des guards :**

```typescript
{
  path: 'admin-panel',
  component: AdminCtrlPage,
  canActivate: [authGuard, roleGuard('admin')]
}
```

---

## Navigation programmatique

### Depuis un composant

```typescript
constructor(private router: Router) {}

// Navigation simple
goToProfile() {
  this.router.navigate(['/profile']);
}

// Navigation avec paramètres
goToProduct(productId: string) {
  this.router.navigate(['/product-page', productId]);
}

// Navigation avec query params
searchProducts(query: string) {
  this.router.navigate(['/'], { 
    queryParams: { search: query } 
  });
}

// Navigation relative
goBack() {
  this.router.navigate(['../'], { relativeTo: this.route });
}
```

### Navigation avec Location API

```typescript
import { Location } from '@angular/common';

constructor(private location: Location) {}

goBack() {
  this.location.back();
}
```

### Navigation dans les templates

```html
<!-- Lien simple -->
<a routerLink="/profile">Mon profil</a>

<!-- Lien avec paramètres -->
<a [routerLink]="['/product-page', product.id]">Voir le produit</a>

<!-- Lien avec classe active -->
<a routerLink="/cart" routerLinkActive="active">Panier</a>

<!-- Navigation programmatique -->
<button (click)="router.navigate(['/cart'])">Aller au panier</button>
```

---

## Paramètres de route

### 1. Route Parameters (obligatoires)

**Définition :**
```typescript
{ path: 'product-page/:id', component: Productpage }
```

**Récupération :**
```typescript
// Observable (recommandé)
this.route.paramMap.subscribe(params => {
  const id = params.get('id');
});

// Snapshot (pour valeur unique)
const id = this.route.snapshot.paramMap.get('id');
```

### 2. Query Parameters (optionnels)

**Navigation avec query params :**
```typescript
this.router.navigate(['/'], {
  queryParams: { 
    search: 'ceramics',
    category: 'art',
    minPrice: 10
  }
});
```

**Récupération :**
```typescript
// Observable
this.route.queryParamMap.subscribe(params => {
  const search = params.get('search');
  const category = params.get('category');
});

// Snapshot
const search = this.route.snapshot.queryParamMap.get('search');
```

### 3. Fragment (ancres)

**Navigation avec fragment :**
```typescript
this.router.navigate(['/about'], { fragment: 'contact' });
```

**Récupération :**
```typescript
this.route.fragment.subscribe(fragment => {
  if (fragment) {
    // Scroll vers l'élément
    document.getElementById(fragment)?.scrollIntoView();
  }
});
```

---

## Exemples pratiques

### Exemple 1 : Navigation depuis la recherche

```typescript
// homepage.ts
onSearch(query: string) {
  this.filterService.setSearchQuery(query);
  this.router.navigate(['/'], {
    queryParams: { q: query }
  });
}
```

### Exemple 2 : Redirection après login

```typescript
// login-page.ts
async onSubmit() {
  const result = await this.authService.login(email, password);
  
  if ('user' in result) {
    // Récupérer l'URL de retour
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
    this.router.navigate([returnUrl]);
  }
}
```

### Exemple 3 : Navigation avec état

```typescript
// Passer des données sans URL
this.router.navigate(['/cart'], {
  state: { fromCheckout: true }
});

// Récupérer les données
const state = this.router.getCurrentNavigation()?.extras.state;
if (state?.fromCheckout) {
  // Afficher un message
}
```

---

## Stratégies de routing

### LocationStrategy

Par défaut, Angular utilise `PathLocationStrategy` (HTML5 pushState) :
- URLs propres : `/product-page/123`
- Nécessite configuration serveur pour gérer les routes

Alternative `HashLocationStrategy` :
- URLs avec hash : `/#/product-page/123`
- Pas de configuration serveur nécessaire

**Configuration (si nécessaire) :**

```typescript
// app.config.ts
import { provideRouter, withHashLocation } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation())
  ]
};
```

---

## Bonnes pratiques

### 1. Organisation des routes

```typescript
// Grouper par feature
const productRoutes: Routes = [
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail }
];

const userRoutes: Routes = [
  { path: 'profile', component: Profile },
  { path: 'settings', component: Settings }
];

export const routes: Routes = [
  ...productRoutes,
  ...userRoutes,
  { path: '**', redirectTo: '' }
];
```

### 2. Lazy loading

```typescript
// Pour de grandes features
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.routes')
    .then(m => m.ADMIN_ROUTES)
}
```

### 3. Résolution de données

```typescript
// Créer un resolver
export const productResolver: ResolveFn<Product> = (route) => {
  const productService = inject(ProductService);
  const id = route.paramMap.get('id')!;
  return productService.getProductById(id);
};

// Utiliser dans la route
{
  path: 'product-page/:id',
  component: Productpage,
  resolve: { product: productResolver }
}

// Accéder aux données résolues
this.route.data.subscribe(data => {
  this.product = data['product'];
});
```

### 4. Gestion des erreurs 404

```typescript
{
  path: 'not-found',
  component: NotFoundComponent
},
{
  path: '**',
  redirectTo: 'not-found'
}
```

---

## Debugging du routing

### Activer les traces de routing

```typescript
// app.config.ts
import { provideRouter, withDebugTracing } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withDebugTracing())
  ]
};
```

### Inspecter l'état du routing

```typescript
constructor(private router: Router) {
  // URL actuelle
  console.log(this.router.url);
  
  // État de navigation
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      console.log('Navigation terminée:', event.url);
    }
  });
}
```

---

## Conclusion

Le système de routing d'ArtisanArt est simple et efficace, avec :
- Routes publiques et authentifiées bien séparées
- Utilisation de paramètres pour les pages dynamiques
- Navigation fluide entre les différentes sections

**Améliorations recommandées :**
1. Ajouter des guards pour sécuriser les routes
2. Implémenter le lazy loading pour les features volumineuses
3. Ajouter une page 404 personnalisée
4. Créer des resolvers pour pré-charger les données critiques