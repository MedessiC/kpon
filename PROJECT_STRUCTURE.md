# 📁 Structure du Projet

## Vue d'ensemble

```
kpon/
├── 📄 root files (config)
│   ├── package.json
│   ├── bun.lockb
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── playwright.config.ts
│   ├── .env
│   ├── .env.example
│   └── .gitignore
│
├── 📖 Documentation
│   ├── README.md                    # Guide général
│   ├── ARCHITECTURE.md              # Patterns et flows
│   ├── CONTRIBUTING.md              # Guide de contribution
│   ├── DEPLOYMENT.md                # Deployment sur Vercel
│   ├── SUPABASE.md                  # Intégration Supabase
│   ├── FEDAPAY.md                   # Intégration paiements
│   ├── COMMANDS.md                  # Commandes utiles
│   └── CHANGES.md                   # Résumé des changements
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # GitHub Actions CI/CD
│
├── public/
│   └── robots.txt
│
├── src/
│   ├── 📄 Entry points
│   │   ├── main.tsx                 # Point d'entrée Vite
│   │   └── vite-env.d.ts           # Types Vite
│   │
│   ├── 📱 Pages (Route components)
│   │   ├── Index.tsx                # Page d'accueil
│   │   ├── Auth.tsx                 # Connexion/Inscription
│   │   ├── Dashboard.tsx            # Tableau de bord
│   │   ├── NewProject.tsx           # Créer un projet
│   │   ├── ClientPreview.tsx        # Aperçu du client
│   │   └── NotFound.tsx             # 404
│   │
│   ├── 🧩 Components
│   │   ├── Logo.tsx                 # Logo réutilisable
│   │   ├── NavLink.tsx              # Lien de navigation
│   │   │
│   │   └── ui/ (shadcn/ui components)
│   │       ├── accordion.tsx
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── pagination.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   │
│   ├── 🪝 Hooks (React Hooks)
│   │   ├── useAuthStore.ts          # Zustand store pour auth
│   │   ├── useAuth.ts               # Hooks authentification
│   │   ├── useProject.ts            # Hooks projets
│   │   ├── usePayment.ts            # Hooks paiements
│   │   └── use-mobile.tsx           # Hook responsive
│   │
│   ├── 📚 Lib (Utilitaires et services)
│   │   ├── utils.ts                 # Utilitaires généraux
│   │   ├── api-client.ts            # Client axios + interceptors
│   │   ├── schemas.ts               # Validation Zod
│   │   ├── sentry.ts                # Config Sentry
│   │   ├── error-handler.ts         # Gestion centralisée erreurs
│   │   │
│   │   └── services/                # Business logic
│   │       ├── index.ts             # Exports des services
│   │       ├── auth.service.ts      # Auth API calls
│   │       ├── project.service.ts   # Project API calls
│   │       └── payment.service.ts   # Payment API calls
│   │
│   ├── 📋 Types (TypeScript interfaces)
│   │   └── index.ts                 # User, Project, etc.
│   │
│   ├── 🧪 Test (Tests unitaires)
│   │   ├── example.test.ts          # Tests validation schemas
│   │   ├── api-client.test.ts       # Tests API client
│   │   ├── auth-store.test.ts       # Tests Zustand store
│   │   └── setup.ts                 # Setup Vitest
│   │
│   ├── 🎨 Styles
│   │   ├── index.css                # Styles globaux
│   │   └── App.css                  # Styles App
│   │
│   └── 📦 Components racine
│       └── App.tsx                  # Composant racine avec routing
│
└── index.html                       # Entry HTML
```

## 🔍 Détails par dossier

### `/src/pages` - Pages
Pages ReactRouter correspondant exactement aux routes :
- **Index.tsx** → Route `/` (Landing page)
- **Auth.tsx** → Route `/auth` (Login/Signup)
- **Dashboard.tsx** → Route `/dashboard` (User dashboard)
- **NewProject.tsx** → Route `/projects/new` (Create project)
- **ClientPreview.tsx** → Route `/p/:projectId` (Client preview)
- **NotFound.tsx** → Route `*` (404)

### `/src/components` - Réutilisables
- **Éléments généraux** : Logo, NavLink
- **shadcn/ui** : Bibliothèque UI importée depuis npm
- Chaque composant peut être utilisé dans plusieurs pages

### `/src/hooks` - Logique réutilisable
- **Custom Hooks** : useAuthStore, useAuth, useProject, usePayment
- **Intègrent React Query** pour le caching
- **Gèrent les états complexes**

### `/src/lib` - Services et utilitaires
```
lib/
├── api-client.ts        # ← Toutes les requêtes HTTP passent par ici
├── services/             # ← Contient la logique métier
│   ├── auth.service.ts
│   ├── project.service.ts
│   └── payment.service.ts
├── schemas.ts            # ← Validation Zod pour toutes les formes
├── sentry.ts            # ← Error tracking
└── error-handler.ts     # ← Gestion centralisée des erreurs
```

### `/src/types` - Type definitions
- **Interfaces pour** : User, Project, Payment, etc.
- **Générées une fois**, réutilisées partout
- **Single source of truth** pour les types

### `/src/test` - Tests
- **Unit tests** pour la logique métier
- **Vitest** pour l'exécution
- **Coverage** des services, hooks, validation

## 🔄 Flux Données

```
UI Component (pages/components)
    ↓
Hooks (useProject, useAuth, etc.)
    ↓
React Query Mutations/Queries
    ↓
Services (project.service.ts, etc.)
    ↓
API Client (api-client.ts)
    ↓
Axios Interceptors
    ↓
Backend API
    ↓
Response → Error Handler (sentry.ts)
    ↓
React Query Cache
    ↓
Component Update
```

## 📦 Dépendances Clés

```
Frontend:
├── React 18            (UI)
├── TypeScript          (Type safety)
├── Vite                (Build)
├── Tailwind CSS        (Styling)
├── React Router        (Routing)
├── React Query         (Server state)
├── Zustand             (Client state)
├── react-hook-form     (Forms)
├── Zod                 (Validation)
├── Axios               (HTTP)
├── Sentry              (Error tracking)
└── shadcn/ui           (Components)

Dev:
├── Vitest              (Testing)
├── ESLint              (Linting)
├── Playwright          (E2E testing)
└── PostCSS             (CSS processing)
```

## 🚀 Adding New Features

### Ajouter une nouvelle page

1. Créer le fichier dans `/src/pages/MyPage.tsx`
2. Ajouter la route dans `App.tsx`
3. Importer les composants UI et hooks

```typescript
// src/pages/MyPage.tsx
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/useProject";

export default function MyPage() {
  const { data: project } = useProject("123");
  
  return (
    <div>
      <h1>{project?.title}</h1>
      <Button>Click me</Button>
    </div>
  );
}
```

### Ajouter un nouveau service

1. Créer `/src/lib/services/my.service.ts`
2. Implémenter avec apiClient
3. Exporter depuis `index.ts`

```typescript
// src/lib/services/my.service.ts
import { apiClient } from "@/lib/api-client";

export const myService = {
  async getMyData() {
    return apiClient.get("/my-endpoint");
  }
};
```

### Ajouter un hook custom

1. Créer `/src/hooks/useMyFeature.ts`
2. Utiliser React Query + Services

```typescript
// src/hooks/useMyFeature.ts
import { useMutation } from "@tanstack/react-query";
import { myService } from "@/lib/services";

export function useMyFeature() {
  return useMutation({
    mutationFn: myService.getMyData,
  });
}
```

## 📊 Total Files

```
- Config files: 12
- Documentation: 8
- Pages: 6
- Components: 30+
- Hooks: 5
- Services: 3
- Utilities: 5
- Tests: 3
- Types: 1
- Styles: 2

Total: ~80 files (sans node_modules)
```

---

**Next?** Lire `ARCHITECTURE.md` pour comprendre les patterns!
