# 🔧 Commandes Utiles

## 🚀 Démarrage

```bash
# Installation
bun install

# Dev server (hot reload)
bun dev

# Build pour production
bun run build

# Preview du build
bun run preview
```

## 🧪 Testing

```bash
# Exécuter tous les tests une fois
bun run test

# Watch mode (re-run on changes)
bun run test:watch

# Coverage report
bun run test -- --coverage

# Test un fichier spécifique
bun run test src/test/auth-store.test.ts
```

## 📝 Code Quality

```bash
# ESLint check
bun run lint

# TypeScript check (sans build)
bunx tsc --noEmit

# Format le code (si configured)
bunx prettier --write src/

# Check import order
bunx eslint src/ --fix
```

## 📦 Dépendances

```bash
# Ajouter une dépendance
bun add package-name

# Ajouter une devDependency
bun add -D package-name

# Mettre à jour toutes les deps
bun update

# Voir les outdated packages
bun outdated

# Audit de sécurité
bun audit

# Installer exactement le lockfile
bun install --frozen-lockfile
```

## 🗄️ Supabase

```bash
# Démarrer l'émulateur local
supabase start

# Arrêter l'émulateur
supabase stop

# Voir les logs
supabase logs

# Créer une migration
supabase migration new add_column

# Appliquer les migrations
supabase db push

# Seed la base
supabase db seed
```

## 🔍 Debug

```bash
# Voir les logs du dev server
bun dev --debug

# Deboguer avec Node debugger
bun run --inspect dev

# VSCode debug config existant dans .vscode/launch.json
```

## 📊 Performance

```bash
# Analyser la taille du bundle
bunx vite-plugin-visualizer

# Check les imports inutilisés
bun run lint

# Profile le build
bun run build -- --profile
```

## 🚀 Deployment

```bash
# Build pour production
bun run build

# Vérifier que le build fonctionne
bun run preview

# Linter avant de pusher
bun run lint

# Tests avant de pusher
bun run test

# Git workflow
git checkout -b feature/my-feature
git add .
git commit -m "feat: description"
git push origin feature/my-feature
# Ouvrir PR sur GitHub
```

## 🔐 Sécurité

```bash
# Audit pour vulnérabilités
bun audit

# Check les secrets commits
bun run lint # règles ESLint pour console logs

# Vérifier .env n'est pas en git
git ls-files | grep .env
```

## 📱 Émulation Mobile

```bash
# Firefox DevTools : F12 → Responsive Design Mode (Ctrl+Shift+M)
# Chrome DevTools : F12 → Toggle device toolbar (Ctrl+Shift+M)

# Tester sur vrai appareil
bun dev  # Server lance sur 0.0.0.0:8080
# Accéder depuis téléphone : http://<votre-ip>:8080
```

## 🐛 Troubleshooting

```bash
# Clear cache
rm -rf node_modules/.vite
rm -rf .next  # Si Next.js

# Réinstaller deps
rm bun.lockb
bun install

# Nettoyer tout
bun clean  # La plupart des tools supportent ça

# Check les processus qui occupent les ports
# Linux/Mac:
lsof -i :8080

# Windows:
netstat -ano | findstr :8080
```

## 📚 Documentation

```bash
# Générer la doc JSDoc
bunx jsdoc src/ -d docs/

# Servir la documentation
cd docs && npx http-server
```

## 🔄 Git Useful

```bash
# Voir les changements
git status
git diff

# Ajouter des changements
git add .
git add src/  # Ajouter un dossier

# Commit
git commit -m "type(scope): message"

# Push vers remote
git push origin feature-branch

# Pull changements
git pull origin main

# Rebase au lieu de merge
git rebase main feature-branch

# Voir l'historique
git log --oneline
git log --graph --all --decorate

# Annuler un commit (local)
git reset HEAD~1

# Annuler les changements
git checkout src/file.tsx
git reset --hard  # Attention: irréversible!
```

## 🔗 Liens Utiles

- [Bun Docs](https://bun.sh/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod Docs](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)
- [React Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.vercel.app)

## 💡 Tips

```bash
# Alias pour des commandes longues
alias bdev="bun dev"
alias btest="bun run test:watch"
alias blint="bun run lint"

# Git shortcut
alias gst="git status"
alias gadd="git add ."
alias gcm="git commit -m"
alias gpu="git push origin"
```

---

**Besoin d'aide ?** Run `--help` sur n'importe quelle commande!

```bash
bun --help
bun dev --help
```
