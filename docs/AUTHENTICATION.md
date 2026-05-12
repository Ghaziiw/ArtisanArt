# Authentification - ArtisanArt

## Vue d'ensemble

L'authentification dans ArtisanArt utilise **Better Auth** avec gestion de sessions basée sur des cookies. Le système supporte trois types d'utilisateurs : **Client**, **Artisan**, et **Admin**.

---

## Architecture d'authentification

```
┌─────────────────────────────────────────┐
│         Angular Application              │
│  ┌────────────────────────────────────┐ │
│  │        AuthService                  │ │
│  │  - user$ (Observable)               │ │
│  │  - session$ (Observable)            │ │
│  │  - login()                          │ │
│  │  - logout()                         │ │
│  │  - signUpClient()                   │ │
│  │  - signUpCraftsman()                │ │
│  └────────────────────────────────────┘ │
│               ↓                          │
│  ┌────────────────────────────────────┐ │
│  │      Better Auth Client             │ │
│  │    (src/lib/auth-client.ts)         │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                ↓ HTTP with credentials
┌─────────────────────────────────────────┐
│         Backend API                      │
│      (http://localhost:3000)             │
│  ┌────────────────────────────────────┐ │
│  │      Better Auth Server             │ │
│  │  - Session validation               │ │
│  │  - Cookie management                │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Configuration Better Auth

### Installation

Better Auth est configuré dans `src/lib/auth-client.ts` :

```typescript
import { createAuthClient } from 'better-auth/client';

export const BASE_URL = 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL: BASE_URL,
});
```

### Modification de l'URL

Pour changer l'URL du backend :

```typescript
// Développement local
export const BASE_URL = 'http://localhost:3000';

// Production
export const BASE_URL = 'https://api.artisanart.com';
```

---

## AuthService

Le service d'authentification centralisé se trouve dans `src/app/core/services/auth.service.ts`.

### Propriétés principales

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Observable de l'utilisateur connecté
  public user$: Observable<User | null>;
  
  // Observable de la session active
  public session$: Observable<Session | null>;
  
  // Getter pour l'utilisateur actuel (valeur synchrone)
  get currentUser(): User | null;
}
```

### Méthodes principales

#### getSession()

Récupère la session actuelle depuis l'API :

```typescript
getSession(): Observable<SessionResponse | null> {
  return this.http.get<SessionResponse>(
    `${this.apiUrl}/api/auth/get-session`,
    { withCredentials: true }
  );
}
```

**Utilisation** :
```typescript
this.authService.getSession().subscribe(response => {
  if (response?.user) {
    console.log('User:', response.user);
    console.log('Session:', response.session);
  }
});
```

#### login()

Connecte un utilisateur avec email et mot de passe :

```typescript
async login(email: string, password: string) {
  const res = await authClient.signIn.email({ email, password });
  if (res.data) {
    this.getSession().subscribe(); // Recharge la session
  }
  return res.data || res.error;
}
```

**Utilisation** :
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

#### logout()

Déconnecte l'utilisateur :

```typescript
async logout() {
  this.userSubject.next(null);
  this.sessionSubject.next(null);
  await authClient.signOut();
}
```

**Utilisation** :
```typescript
async handleLogout() {
  await this.authService.logout();
  this.router.navigate(['/']);
}
```

#### signUpClient()

Inscrit un nouveau client :

```typescript
signUpClient(data: ClientSignUpDto): Observable<ClientSignUpResponse> {
  return this.http.post<ClientSignUpResponse>(
    `${this.apiUrl}/api/auth/sign-up/email`,
    data,
    { withCredentials: true }
  );
}
```

**Utilisation** :
```typescript
const clientData: ClientSignUpDto = {
  email: 'client@example.com',
  password: 'SecurePass123',
  name: 'John Doe',
  location: 'Paris, France'
};

this.authService.signUpClient(clientData).subscribe({
  next: (response) => {
    console.log('Client créé:', response);
    this.router.navigate(['/profile']);
  },
  error: (err) => {
    console.error(err.error?.message);
  }
});
```

#### signUpCraftsman()

Inscrit un nouvel artisan :

```typescript
signUpCraftsman(data: CraftsmanSignUpDto): Observable<CraftsmanSignUpResponse> {
  const formData = new FormData();
  
  // Champs requis
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('name', data.name);
  formData.append('businessName', data.businessName);
  formData.append('phone', data.phone);
  formData.append('workshopAddress', data.workshopAddress);
  formData.append('deliveryPrice', data.deliveryPrice.toString());
  
  // Champs optionnels
  if (data.bio) formData.append('bio', data.bio);
  if (data.profileImage) formData.append('profileImage', data.profileImage);
  
  return this.http.post<CraftsmanSignUpResponse>(
    `${this.apiUrl}/craftsmen`,
    formData,
    { withCredentials: true }
  );
}
```

---

## Gestion des rôles

### Vérifier le rôle d'un utilisateur

#### Dans un composant

```typescript
export class MyComponent {
  isAdmin$: Observable<boolean>;
  isArtisan$: Observable<boolean>;
  isClient$: Observable<boolean>;
  
  constructor(private authService: AuthService) {
    this.isAdmin$ = this.authService.user$.pipe(
      map(user => user?.role === 'admin')
    );
    
    this.isArtisan$ = this.authService.user$.pipe(
      map(user => user?.role === 'artisan')
    );
    
    this.isClient$ = this.authService.user$.pipe(
      map(user => user?.role === 'client')
    );
  }
}
```

#### Dans le template

```html
<!-- Afficher uniquement pour les admins -->
<button *ngIf="isAdmin$ | async">
  Admin Panel
</button>

<!-- Afficher uniquement pour les artisans -->
<button *ngIf="isArtisan$ | async" routerLink="/my-store">
  Ma Boutique
</button>

<!-- Afficher uniquement pour les clients -->
<button *ngIf="isClient$ | async" routerLink="/orders">
  Mes Commandes
</button>

<!-- Afficher pour tous les utilisateurs connectés -->
<button *ngIf="authService.user$ | async">
  Mon Profil
</button>
```

---

## Guards de route

### Créer un guard d'authentification

```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

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

### Guard pour les rôles

```typescript
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.user$.pipe(
    map(user => {
      if (user?.role === 'admin') return true;
      return router.createUrlTree(['/']);
    })
  );
};

export const artisanGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.user$.pipe(
    map(user => {
      if (user?.role === 'artisan') return true;
      return router.createUrlTree(['/']);
    })
  );
};
```

### Utilisation dans les routes

```typescript
export const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'my-store',
    component: MyStoreComponent,
    canActivate: [artisanGuard]
  }
];
```

---

## Gestion des sessions

### Chargement automatique de la session

Le service charge automatiquement la session au démarrage :

```typescript
constructor(private http: HttpClient) {
  this.loadSession(); // Appelé automatiquement
}

loadSession(): void {
  if (typeof window === 'undefined') return; // Éviter SSR
  this.getSession().subscribe();
}
```

### Vérifier l'état de connexion

```typescript
// Dans un composant
ngOnInit() {
  this.authService.user$.subscribe(user => {
    if (user) {
      console.log('Utilisateur connecté:', user.name);
      console.log('Rôle:', user.role);
    } else {
      console.log('Utilisateur non connecté');
    }
  });
}
```

### Session avec credentials

Tous les appels API nécessitant une authentification doivent inclure `withCredentials: true` :

```typescript
this.http.get(url, { withCredentials: true })
this.http.post(url, data, { withCredentials: true })
```

---

## Patterns d'utilisation

### Pattern 1 : Redirection après login

```typescript
async handleLogin() {
  const result = await this.authService.login(
    this.email,
    this.password
  );
  
  if ('user' in result) {
    const user = result.user;
    
    // Redirection selon le rôle
    switch (user.role) {
      case 'admin':
        this.router.navigate(['/admin-panel']);
        break;
      case 'artisan':
        this.router.navigate(['/my-store']);
        break;
      case 'client':
        this.router.navigate(['/']);
        break;
    }
  } else {
    this.errorMessage = 'Email ou mot de passe incorrect';
  }
}
```

### Pattern 2 : Affichage conditionnel

```typescript
export class HeaderComponent {
  isLoggedIn$: Observable<boolean>;
  userName$: Observable<string>;
  
  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.user$.pipe(
      map(user => !!user)
    );
    
    this.userName$ = this.authService.user$.pipe(
      filter(user => !!user),
      map(user => user!.name)
    );
  }
}
```

```html
<!-- Dans le template -->
<div *ngIf="isLoggedIn$ | async">
  Bienvenue, {{ userName$ | async }} !
</div>

<button *ngIf="!(isLoggedIn$ | async)" routerLink="/login">
  Se connecter
</button>
```

### Pattern 3 : Appel API protégé

```typescript
loadUserData() {
  // Attendre que l'utilisateur soit chargé
  this.authService.user$.pipe(
    filter(user => !!user),
    take(1),
    switchMap(user => this.dataService.getUserData(user.id))
  ).subscribe(data => {
    this.userData = data;
  });
}
```

---

## Gestion des erreurs

### Erreurs de connexion

```typescript
async handleLogin() {
  try {
    const result = await this.authService.login(email, password);
    
    if ('error' in result) {
      // Gérer l'erreur
      switch (result.error.status) {
        case 401:
          this.errorMessage = 'Email ou mot de passe incorrect';
          break;
        case 403:
          this.errorMessage = 'Compte désactivé';
          break;
        default:
          this.errorMessage = 'Erreur de connexion';
      }
    }
  } catch (error) {
    console.error('Erreur inattendue:', error);
    this.errorMessage = 'Erreur de connexion';
  }
}
```

### Expiration de session

```typescript
// Intercepteur pour gérer les 401
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const authService = inject(AuthService);
        const router = inject(Router);
        
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
```

---

## Sécurité

### Bonnes pratiques

1. **Toujours utiliser HTTPS en production**
```typescript
export const BASE_URL = 'https://api.artisanart.com';
```

2. **Valider les mots de passe**
```typescript
isValidPassword(password: string): boolean {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password);
}
```

3. **Ne jamais stocker de tokens côté client**
```typescript
// ❌ Mauvais
localStorage.setItem('token', token);

// ✅ Bon - Better Auth gère les cookies automatiquement
```

4. **Vérifier les permissions côté serveur**
```typescript
// Le frontend vérifie pour l'UX, mais le backend DOIT aussi vérifier
```

### Considérations SSR

```typescript
// Vérifier la plateforme avant d'accéder au localStorage/sessionStorage
if (typeof window !== 'undefined') {
  // Code navigateur uniquement
}
```

---

## Débogage

### Vérifier l'état d'authentification

```typescript
// Dans la console du navigateur
ngOnInit() {
  this.authService.user$.subscribe(user => {
    console.log('Current user:', user);
  });
  
  this.authService.session$.subscribe(session => {
    console.log('Current session:', session);
  });
}
```

### Tester les guards

```typescript
// Accéder à une route protégée sans être connecté
// Devrait rediriger vers /login
```

### Vérifier les cookies

1. Ouvrir DevTools → Application → Cookies
2. Vérifier la présence du cookie de session
3. Vérifier que le cookie a les flags HttpOnly et Secure (en production)

---

## Ressources

- [Better Auth Documentation](https://better-auth.com)
- [Angular Authentication Guide](https://angular.io/guide/security)
- Documentation des services : [SERVICES.md](./SERVICES.md)
- Modèles de données : [MODELS.md](./MODELS.md)