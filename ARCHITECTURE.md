# Architecture et Patterns

## 🏗️ Architecture Globale

```
┌─────────────────────────────────────┐
│        React Components              │
│     (Pages, Custom Components)       │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│         React Query + Hooks          │
│   (Query Caching, State Management)  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│       Service Layer (Services)       │
│  (Business Logic, API Calls)         │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│        API Client (axios)            │
│  (HTTP Requests, Interceptors)       │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│           Backend API                │
│    (Supabase / Node.js Server)       │
└──────────────────────────────────────┘
```

## 🔄 Data Flow

1. **Component → Hook** : Component appelle un hook custom
2. **Hook → Query/Mutation** : Hook utilise React Query pour gérer la requête
3. **Query → Service** : React Query appelle le service
4. **Service → API Client** : Service utilise axios pour la requête
5. **API Client → Backend** : Envoi de la requête HTTP avec authentification
6. **Backend → API Client** : Réponse retournée
7. **API Client → Service** : Données formatées
8. **Service → Hook** : Succès/Erreur retourne au hook
9. **Hook → Component** : Composant met à jour l'UI

## 🔐 Authentification

### Flow de connexion

```
1. User input (email, password)
   ↓
2. Validation avec Zod
   ↓
3. useLogin() hook appelé
   ↓
4. authService.login(credentials)
   ↓
5. API POST /auth/login
   ↓
6. Backend retourne { user, token, refreshToken }
   ↓
7. useAuthStore.setUser() et setTokens()
   ↓
8. Token sauvegardé en localStorage (persistance)
   ↓
9. Redirection vers /dashboard
```

### Persistance

Le token est sauvegardé en localStorage via Zustand persist middleware, donc l'utilisateur reste connecté même après le refresh de la page.

## 💾 State Management

### Zustand (Auth Store)

```typescript
// Store centralisé pour l'authentification
- user: User | null
- token: string | null
- refreshToken: string | null
- isAuthenticated: boolean

// Actions
- setUser(user)
- setTokens(token, refreshToken)
- logout()
- reset()
```

### React Query (Data Fetching)

```typescript
// Données côté serveur gérées par React Query
- Projects cache
- User data cache
- Payment history cache

// Auto-invalidation après mutations
- Après createProject → invalide le cache projects
- Après updateProfile → invalide le cache user
```

## 🛡️ Validation

### Serveur-side

Tous les inputs sont validés côté client ET serveur avec des schémas Zod identiques.

```typescript
// Client-side (React)
const validated = LoginSchema.parse(formData);

// Server-side (Node.js)
const validated = LoginSchema.parse(requestBody);
```

## ⚠️ Error Handling

### Global Error Flow

```
Error occurs
  ↓
Caught in try-catch ou catch() de mutation
  ↓
handleError() called
  ↓
├─ Log to Sentry (development mode logs also)
├─ Display toast.error() to user
└─ Return ApiError object

API Error format:
{
  message: string,      // Affiché à l'utilisateur
  code: string,         // Pour debug
  statusCode: number    // HTTP status
}
```

### 401 Unauthorized

Automatiquement gérée par l'intercepteur axios:
1. Si status 401
2. Appelle logout()
3. Redirige vers /auth

## 📦 Dependencies

### Core
- **React 18** : UI library
- **TypeScript** : Type safety
- **Vite** : Build tool
- **Tailwind CSS** : Styling

### Data Management
- **React Query** : Server state caching
- **Zustand** : Client state (auth)
- **Axios** : HTTP client

### Forms & Validation
- **react-hook-form** : Form state
- **zod** : Schema validation
- **@hookform/resolvers** : Integration

### UI Components
- **shadcn/ui** : Component library
- **Radix UI** : Headless components
- **Lucide React** : Icons
- **Sonner** : Toast notifications

### Error Tracking
- **Sentry** : Error tracking & monitoring
- **@sentry/react** : React integration
- **sentry/tracing** : Performance monitoring

### Development
- **ESLint** : Code linting
- **Vitest** : Unit testing
- **TypeScript ESLint** : TS linting
- **Playwright** : E2E testing

## 🔄 API Communication

### Request Interceptor

Ajoute automatiquement le Bearer token:

```typescript
config.headers.Authorization = `Bearer ${token}`;
```

### Response Interceptor

Gère les erreurs globales, notamment 401:

```typescript
if (error.response?.status === 401) {
  useAuthStore.getState().logout();
  window.location.href = "/auth";
}
```

## 📊 Performance Considerations

1. **Query Stale Time** : 5 minutes par défaut
2. **Request Timeout** : 30 secondes
3. **Retry Policy** : 1 retry sur erreur
4. **Code Splitting** : Route-based splitting avec Vite
5. **Image Optimization** : Servir en WebP quand possible

## 🧪 Testing Strategy

### Unit Tests
- Validation schemas (Zod)
- Utility functions
- Store actions

### Integration Tests
- API client interceptors
- Service layer

### E2E Tests
- User workflows (login, create project, pay)
- Form submission
- Error flows

## 📱 Responsive Design

Point de rupture Tailwind :
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md)
- Desktop: > 1024px (lg)

L'appli est **mobile-first** : styles mobile par défaut, puis breakpoints pour élargir.

## 🔒 Security Practices

1. **CORS** : Allowlist des origins
2. **HTTPS** : Enforcer en production
3. **Helmet.js** : Headers de sécurité (serveur)
4. **JWT Refresh** : Tokens courts + refresh tokens
5. **Input Validation** : Zod côté client et serveur
6. **Rate Limiting** : Sur API (serveur)
7. **SQL Injection** : Queries paramétrées (Supabase)

## 🚀 Deployment

### Frontend (Vercel / Netlify)

```bash
bun run build
# Deploy dist/ folder
```

### Environment variables production

```env
VITE_API_URL=https://api.kpon.com
VITE_SUPABASE_URL=<prod_url>
VITE_SUPABASE_ANON_KEY=<prod_key>
VITE_SENTRY_DSN=<prod_dsn>
VITE_APP_ENV=production
```

### Backend (Supabase / Heroku)

- Authentification : Supabase Auth
- Storage : Supabase Storage
- Database : Supabase PostgreSQL
- Deployment : Self-hosted ou cloud

---

**For more questions, refer to individual service/hook documentation**
