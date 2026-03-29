# 🎨 KPON - Plateforme de Livraison Sécurisée pour Designers

KPON est une plateforme web où les freelances designers africains peuvent héberger et monétiser leurs travaux de manière sécurisée. Les clients paient via Mobile Money avant de recevoir les fichiers.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Bun (recommandé) ou npm
- Git

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd kpon

# Installer les dépendances
bun install

# Copier l'environnement
cp .env.example .env

# Démarrer le serveur de développement
bun dev
```

Le serveur sera accessible à `http://localhost:8080`

## 📁 Structure du Projet

```
src/
  ├── components/        # Composants React réutilisables
  │   ├── ui/           # Composants shadcn/ui
  │   ├── Logo.tsx
  │   └── NavLink.tsx
  ├── pages/            # Pages principales
  │   ├── Index.tsx     # Page d'accueil
  │   ├── Auth.tsx      # Authentification
  │   ├── Dashboard.tsx # Tableau de bord
  │   ├── NewProject.tsx # Créer un projet
  │   ├── ClientPreview.tsx # Aperçu du client
  │   └── NotFound.tsx  # 404
  ├── hooks/            # Hooks React personnalisés
  │   ├── useAuthStore.ts # Store Zustand pour auth
  │   ├── useAuth.ts    # Hooks d'authentification
  │   ├── useProject.ts # Hooks de projets
  │   └── usePayment.ts # Hooks de paiements
  ├── lib/              # Utilitaires et services
  │   ├── api-client.ts # Client HTTP (axios)
  │   ├── services/     # Services API
  │   │   ├── auth.service.ts
  │   │   ├── project.service.ts
  │   │   ├── payment.service.ts
  │   │   └── index.ts
  │   ├── schemas.ts    # Schémas de validation (Zod)
  │   ├── sentry.ts     # Configuration Sentry
  │   └── error-handler.ts # Gestion globale des erreurs
  ├── types/            # Types TypeScript
  │   └── index.ts
  ├── test/             # Tests unitaires et d'intégration
  │   ├── example.test.ts
  │   ├── api-client.test.ts
  │   └── auth-store.test.ts
  ├── App.tsx           # Composant racine
  └── main.tsx          # Point d'entrée
```

## 🔐 Authentification

L'authentification est gérée avec Zustand + React Query et intégrée à Supabase.

### Configuration

1. Créer un projet Supabase
2. Ajouter les variables d'environnement dans `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Utilisation

```typescript
import { useLogin, useLogout, useCurrentUser } from "@/hooks/useAuth";

function MyComponent() {
  const login = useLogin();
  const { data: user } = useCurrentUser();
  
  const handleLogin = async (email: string, password: string) => {
    await login.mutateAsync({ email, password });
  };
  
  return <div>User: {user?.name}</div>;
}
```

## 💳 Paiements

Les paiements sont traités via FedaPay (réseau Mobile Money en Afrique de l'Ouest).

### Configuration

1. S'enregistrer sur [FedaPay](https://fedapay.com)
2. Ajouter les variables d'environnement:
```env
VITE_FEDAPAY_PUBLIC_KEY=your_public_key
VITE_FEDAPAY_ENVIRONMENT=production
```

### Utilisation

```typescript
import { useInitiatePayment, usePaymentStatus } from "@/hooks/usePayment";

function PaymentComponent() {
  const initiatePayment = useInitiatePayment();
  const { data: status } = usePaymentStatus(transactionId);
  
  const handlePay = async (amount: number, projectId: string) => {
    const response = await initiatePayment.mutateAsync({
      amount,
      projectId,
      phoneNumber: "+22312345678"
    });
    // Rediriger vers FedaPay
    window.location.href = response.redirectUrl;
  };
  
  return <button onClick={() => handlePay(50000, "proj123")}>Payer</button>;
}
```

## 📤 Upload de Fichiers

Les fichiers sont stockés dans Supabase Storage.

### Configuration

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Utilisation

```typescript
import { useUploadFile } from "@/hooks/useProject";

function FileUpload() {
  const uploadFile = useUploadFile();
  
  const handleFileSelect = async (file: File) => {
    const response = await uploadFile.mutateAsync(file);
    console.log("File uploaded:", response.url);
  };
  
  return (
    <input 
      type="file" 
      onChange={(e) => handleFileSelect(e.target.files?.[0]!)}
    />
  );
}
```

## 🧪 Tests

```bash
# Exécuter les tests
bun run test

# Mode watch
bun run test:watch

# Coverage
bun run test -- --coverage
```

### Écrire des tests

```typescript
import { describe, it, expect } from "vitest";

describe("mon composant", () => {
  it("devrait faire quelque chose", () => {
    expect(true).toBe(true);
  });
});
```

## 🔍 Suivi des erreurs

Les erreurs sont automatiquement envoyées à Sentry.

### Configuration

```env
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/123456
VITE_SENTRY_ENVIRONMENT=production
```

Les erreurs sont capturées automatiquement en production.

## 🎨 Design System

Le projet utilise shadcn/ui + Tailwind CSS.

### Composants disponibles

```typescript
import {
  Button,
  Input,
  Label,
  Card,
  Dialog,
  Tabs,
  Table,
  // ... et plus
} from "@/components/ui";
```

## 🔒 Validation des Données

Tous les formulaires utilisent Zod pour la validation:

```typescript
import { LoginSchema } from "@/lib/schemas";

const data = { email: "test@example.com", password: "pass123" };
const validated = LoginSchema.parse(data); // Lance une erreur si invalide
```

### Schémas disponibles

- `LoginSchema` - Connexion
- `SignupSchema` - Inscription
- `ProjectSchema` - Création de projet
- `PaymentSchema` - Initiation de paiement

## 📊 Performance

### Optimisations appliquées

- ✅ TypeScript strict
- ✅ React Query pour le caching
- ✅ Lazy loading des composants
- ✅ Code splitting avec Vite
- ✅ Compression des images
- ✅ Rate limiting côté API

### Monitoring

Utilisez Sentry pour :
- Suivi des erreurs
- Performance monitoring
- Session replay
- Custom metrics

## 🚀 Build et Déploiement

```bash
# Build de production
bun run build

# Preview du build
bun run preview

# Linter
bun run lint
```

### Configuration d'environnement pour production

```env
VITE_API_URL=https://api.kpon.com
VITE_APP_ENV=production
VITE_SENTRY_ENVIRONMENT=production
```

## 🤝 Contribution

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Standards de code

- TypeScript strict obligatoire
- ESLint doit passer sans erreurs
- Tests requis pour les nouvelles fonctionnalités
- Format avec Prettier

## 📝 License

Ce projet est sous license MIT.

## 📞 Support

Pour toute question ou problème:
- 📧 support@kpon.com
- 🐛 [Issues sur GitHub](https://github.com/kpon/kpon/issues)
- 💬 Discord: [Lien du serveur]

---

**Fait avec ❤️ pour les designers africains**
