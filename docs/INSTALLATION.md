# Installation et Configuration - ArtisanArt

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** : version ≥18.19.1
- **npm** : version ≥9.x
- **Angular CLI** : version 19.x
- **Git** : pour cloner le dépôt

## Installation du projet

### 1. Cloner le dépôt

```bash
git clone [url-du-repo]
cd artisanart
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande installera toutes les dépendances listées dans `package.json`, notamment :
- Angular 19.1.5
- TypeScript 5.7.2
- Better Auth 1.0.14
- RxJS 7.8.0

### 3. Configuration du Backend

Le projet nécessite un serveur backend fonctionnant sur `http://localhost:3000`.

#### Configurer l'URL du backend

Si votre backend utilise un port différent, modifiez le fichier `src/lib/auth-client.ts` :

```typescript
export const BASE_URL = 'http://localhost:3000'; // Modifier selon votre configuration
```

#### Variables d'environnement

Créez un fichier `.env` à la racine si nécessaire (pour le backend) :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/artisanart
JWT_SECRET=your-secret-key
PORT=3000
```

### 4. Lancer l'application

#### Mode développement

```bash
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200`

#### Mode production

```bash
# Build
npm run build

# Avec SSR
npm run build:ssr
npm run serve:ssr:ArtisanArt
```

## Structure des fichiers de configuration

### angular.json

Fichier de configuration principal d'Angular contenant :
- Configuration du build (esbuild)
- Options de développement et production
- Configuration SSR
- Assets et styles globaux

### tsconfig.json

Configuration TypeScript avec :
- Target : ES2022
- Module : ES2022
- Strict mode activé
- Paths aliases configurés

### package.json

Dépendances principales :
```json
{
  "dependencies": {
    "@angular/core": "^19.1.5",
    "better-auth": "^1.0.14",
    "rxjs": "~7.8.0",
    "typescript": "~5.7.2"
  }
}
```

## Configuration Better Auth

### Installation

Better Auth est déjà inclus dans les dépendances. La configuration se trouve dans `src/lib/auth-client.ts`.

### Utilisation

```typescript
import { authClient } from '../../../lib/auth-client';

// Login
const result = await authClient.signIn.email({
  email: 'user@example.com',
  password: 'password'
});

// Logout
await authClient.signOut();
```

## Configuration HTTP

### Providers HTTP

Dans `src/app/app.config.ts` :

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(HttpClientModule),
    // ...
  ]
};
```

### Credentials

Tous les appels API nécessitant une authentification utilisent `withCredentials: true` :

```typescript
this.http.get(url, { withCredentials: true })
```

## Configuration SSR (Server-Side Rendering)

### Activation

Le SSR est configuré dans `src/app/app.config.server.ts` :

```typescript
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};
```

### Routes SSR

Dans `src/app/app.routes.server.ts` :

```typescript
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
```

## Vérification de l'installation

### Tests de base

```bash
# Tests unitaires
npm test

# Tests avec watch
npm run test:watch

# Vérifier la compilation
ng build --configuration development
```

### Vérifier les services

1. **Backend** : `curl http://localhost:3000/api/auth/get-session`
2. **Frontend** : Ouvrir `http://localhost:4200`
3. **SSR** : `npm run build:ssr && npm run serve:ssr:ArtisanArt`

## Résolution des problèmes courants

### Port déjà utilisé

```bash
# Changer le port du frontend
ng serve --port 4201
```

### Erreurs de dépendances

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreurs CORS

Vérifiez que votre backend autorise les requêtes depuis `http://localhost:4200` :

```typescript
// Backend configuration
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

### Erreurs SSR

Si vous rencontrez des erreurs avec le SSR (accès à `window` ou `document`) :

```typescript
// Vérifier la plateforme
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    // Code spécifique au navigateur
  }
}
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance le serveur de développement |
| `npm run build` | Build pour production |
| `npm run build:ssr` | Build avec SSR |
| `npm run serve:ssr:ArtisanArt` | Lance le serveur SSR |
| `npm test` | Lance les tests unitaires |
| `npm run watch` | Mode watch pour le développement |

## Prochaines étapes

Après l'installation :
1. Consultez [Architecture du Projet](./ARCHITECTURE.md)
2. Explorez les [Services et API](./SERVICES.md)
3. Lisez le [Guide de Développement](./DEVELOPMENT.md)