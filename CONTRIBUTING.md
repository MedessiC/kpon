# Guide de Contribution

Merci de vouloir contribuer à KPON ! 🙌

## 🎯 Avant de Commencer

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Créer une branche** pour votre feature : `git checkout -b feature/amazing-feature`
4. **Lire** ce guide completely

## 📋 Standards de Code

### TypeScript

- **Strict mode obligatoire** : `"strict": true`
- **Pas de `any`** : Utilisez des types génériques si possible
- **Explicit return types** sur les fonctions
- **Interfaces pour les objects**, types pour les unions

```typescript
// ✅ BON
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ MAUVAIS
const getUser = (id: string): any => {
  // ...
}
```

### Nommage

- **Composants**: PascalCase (`UserProfile.tsx`)
- **Fonctions/hooks**: camelCase (`useAuthStore`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Fichiers**: Minuscule avec tirets (`auth-store.ts`)
- **Hooks**: Toujours préfixe `use` (`useLogin`)
- **Services**: Suffixe `.service.ts` (`auth.service.ts`)

### Imports

Organiser dans cet ordre:
1. React imports
2. Bibliothèques tierces
3. Imports locaux (@/)
4. Types/interfaces

```typescript
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/services";
import type { User } from "@/types";
```

### Commentaires

- Expliquer le **pourquoi**, pas le quoi
- Pas de commentaires évidemment
- Utiliser JSDoc pour les fonctions publiques

```typescript
// ❌ MAUVAIS
// Incrémenter i
i++;

// ✅ BON
/**
 * Récupère les projets avec pagination
 * @param page - Numéro de la page (1-based)
 * @param limit - Nombre de résultats par page
 */
function getProjects(page: number, limit: number) {
  // ...
}
```

## 🔄 Git Workflow

### Commits

Format des messages de commit :

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types autorisés:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `refactor`: Refactorisation du code
- `perf`: Amélioration de performance
- `test`: Ajout/modification de tests
- `docs`: Changements de documentation
- `style`: Changements de style (ESLint, format)
- `chore`: Dépendances, build, CI/CD

Exemples:

```
feat(auth): implement login with Supabase

- Add LoginSchema validation
- Integrate useLogin hook
- Add error handling with Sentry

Closes #123
```

```
fix(payment): handle expired access tokens
```

### Pull Requests

1. **Description claire** : Qu'est-ce qui change ? Pourquoi ?
2. **Screenshots** si changement UI
3. **Tests** : Tous les tests passent
4. **Pas de merge conflicts**
5. **Rebase** sur `main` avant de merger

Format des PR:

```markdown
## 📝 Description
Brève description de ce que fait cette PR.

## 🔗 Issues
Fixes #123
Related to #456

## 📊 Type de changement
- [ ] 🐛 Bug fix
- [ ] ✨ Nouvelle fonctionnalité
- [ ] 📚 Documentation
- [ ] ⚡ Performance
- [ ] 🔒 Sécurité

## ✅ Checklist
- [ ] Code suit les standards du projet
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de breaking changes
- [ ] Pas de console.log/debugger

## 🎬 Screenshots (le cas échéant)
[Ajouter screenshots pour changements UI]
```

## 🧪 Tests

### Tous les tests doivent passer

```bash
bun run test
bun run lint
```

### Ajouter des tests pour

- ✅ Validation schemas (Zod)
- ✅ Hooks custom
- ✅ Store actions
- ✅ Utility functions
- ✅ Services

### Exemple de test

```typescript
import { describe, it, expect } from "vitest";
import { LoginSchema } from "@/lib/schemas";

describe("LoginSchema", () => {
  it("should validate correct credentials", () => {
    const valid = { email: "test@example.com", password: "password123" };
    expect(() => LoginSchema.parse(valid)).not.toThrow();
  });

  it("should reject invalid email", () => {
    const invalid = { email: "invalid", password: "password123" };
    expect(() => LoginSchema.parse(invalid)).toThrow();
  });
});
```

## 📝 Documentation

### Mettre à jour :
- `README.md` : Changements utilisateur
- `ARCHITECTURE.md` : Changements techniques
- JSDoc : Pour les fonctions publiques
- Inliner les commentaires pour la logique complexe

### Format de documentation

```typescript
/**
 * Crée un nouveau projet
 * @param data - Données du projet
 * @param data.title - Titre du projet
 * @param data.description - Description
 * @param data.price - Prix en CFA
 * @param file - Fichier à uploader
 * @returns Le projet créé
 * @throws {ApiError} Si la création échoue
 * @example
 * const project = await createProject(
 *   { title: "Logo", description: "...", price: 50000 },
 *   file
 * );
 */
export async function createProject(
  data: ProjectFormData,
  file: File
): Promise<Project> {
  // ...
}
```

## 🚀 Nouvelles Fonctionnalités

### Checklist pour une nouvelle feature

1. **Créer une branche** : `git checkout -b feature/my-feature`
2. **Planifier** : Dossier créé dans `src/`
3. **Implémenter** :
   - Types dans `src/types/`
   - Validation dans `src/lib/schemas.ts`
   - Services dans `src/lib/services/`
   - Hooks dans `src/hooks/`
   - Composants dans `src/components/`
   - Pages dans `src/pages/`
4. **Tester** : Tests unitaires + manuels
5. **Documenter** : JSDoc + README/ARCHITECTURE mis à jour
6. **PR** : Ouvrir une Pull Request
7. **Code Review** : Attendre l'approbation
8. **Merger** : Squash + merge

## 🐛 Bugs

### Signaler un bug

1. Vérifier que le bug n'existe pas pas déjà
2. Créer une issue avec:
   - Description claire du bug
   - Steps to reproduce
   - Comportement attendu vs actuel
   - Screenshots/logs
   - Environnement (OS, navigateur, version)

### Fixer un bug

1. Créer une branche : `git checkout -b fix/bug-name`
2. Implémenter la correction
3. Ajouter un test qui reproduit le bug
4. S'assurer que le test passe
5. Ouvrir une PR avec `fixes #<issue-number>`

## 📦 Dépendances

### Ajouter une dépendance

```bash
bun add <package-name>
```

**AVANT d'ajouter une dépendance**:
1. Vérifier si une alternative existe déjà
2. Vérifier la taille du bundle (`npm size`)
3. Vérifier la maintenance du package
4. Documenter pourquoi elle est nécessaire

Pour les dépendances dev:

```bash
bun add -D <package-name>
```

## 🔒 Sécurité

### Ne JAMAIS committer

- 🔑 Clés API ou secrets
- 🔐 Tokens d'accès
- 📧 Informations personnelles
- 💳 Numéros de carte

Utiliser des variables d'environnement `.env.local` à la place.

### Vérifier si du code est sécurisé

- ✅ Inputs validés (côté client ET serveur)
- ✅ Outputs échappés (XSS protection)
- ✅ Pas de SQL injection
- ✅ Pas d'exposé de secrets
- ✅ HTTPS en production
- ✅ CORS correctement configuré

## ❓ Questions ?

- 💬 Discussions : GitHub Discussions
- 🐛 Issues : Pour les bugs
- 💌 Email : support@kpon.com

---

**Merci de contribuer à KPON! 🚀**
