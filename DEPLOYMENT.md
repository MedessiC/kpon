# 🚀 Déploiement Production KPON sur Netlify

Ce guide explique comment déployer KPON en production sur Netlify.

---

## **PRÉALABLE : Fix RLS Policies**

⚠️ **IMPORTANT** : Avant de déployer, exécute ce SQL dans Supabase SQL Editor:

```sql
-- USERS TABLE
DROP POLICY IF EXISTS "Users can insert themselves" ON users;
CREATE POLICY "Users can insert themselves"
ON users FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Users are public" ON users;
CREATE POLICY "Users are public"
ON users FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update themselves" ON users;
CREATE POLICY "Users can update themselves"
ON users FOR UPDATE
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- PROJECTS TABLE
DROP POLICY IF EXISTS "Projects are public" ON projects;
CREATE POLICY "Projects are public"
ON projects FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create projects" ON projects;
CREATE POLICY "Users can create projects"
ON projects FOR INSERT
WITH CHECK (auth.uid()::text = designer_id::text);

DROP POLICY IF EXISTS "Designers can update own" ON projects;
CREATE POLICY "Designers can update own"
ON projects FOR UPDATE
USING (auth.uid()::text = designer_id::text)
WITH CHECK (auth.uid()::text = designer_id::text);

DROP POLICY IF EXISTS "Designers can delete own" ON projects;
CREATE POLICY "Designers can delete own"
ON projects FOR DELETE
USING (auth.uid()::text = designer_id::text);
```

✅ Clique **Run** - Tu devrais voir "Success"

---

## **ÉTAPE 1 : Préparer le repo GitHub**

```bash
# Assure-toi que .env est dans .gitignore (pour ne pas pusher les secrets)
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Commit
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

---

## **ÉTAPE 2 : Créer un compte Netlify**

1. Va sur [netlify.com](https://netlify.com)
2. Clique **Sign up** → Connecte-toi avec **GitHub**
3. Autorise Netlify à accéder à tes repos

---

## **ÉTAPE 3 : Connect le Repository**

1. Dashboard Netlify → **Add new site** → **Import an existing project**
2. Sélectionne **GitHub**
3. Retrouve le repo `kpon` dans la liste
4. Clique **Install**
5. Choisir la branche : `main`

---

## **ÉTAPE 4 : Configure les Build Settings**

### Build Settings (déjà dans netlify.toml)
- **Build command** : `bun run build`
- **Publish directory** : `dist`
- **Node version** : `lts/hydrogen` (18+)

Netlify va lire automatiquement le `netlify.toml` qu'on a créé.

---

## **ÉTAPE 5 : Configure les Variables d'Environnement**

Dans **Netlify Dashboard** :

1. Ton site → **Settings** → **Build & Deploy** → **Environment**
2. Clique **Add environment variables** ou **Edit variables**
3. Ajoute ces variables :

```env
VITE_SUPABASE_URL=https://ubihpicbcftmhmtlcogz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_CLOUDINARY_CLOUD_NAME=dnvul9kes
VITE_CLOUDINARY_UPLOAD_PRESET=kpon_upload
VITE_CLOUDINARY_API_KEY=333234767672453
VITE_SENTRY_DSN=https://your-sentry-dsn-if-you-have-one
VITE_SENTRY_ENVIRONMENT=production
```

✅ Clique **Save**

---

## **ÉTAPE 6 : Configure Supabase pour Production**

### 6a. Allow les Redirect URLs

1. **Supabase Dashboard** → **Authentication** (menu gauche)
2. **URL Configuration** → **Site URL** : 
   - Insérer : `https://your-site-name.netlify.app`
   - (Remplace `your-site-name` par ton nom Netlify auto-généré)

3. **Additional Redirect URLs** → Ajouter:
   ```
   https://your-site-name.netlify.app/auth/callback
   https://your-site-name.netlify.app/dashboard
   ```

✅ Clique **Save**

### 6b. Enable Email Confirmation

1. **Authentication** → **Email** → Coche **Confirm email**
2. **SMTP Configuration** (si tu veux custom emails, optionnel)

---

## **ÉTAPE 7 : Trigger Deploy**

### Option A : Auto-Deploy (Recommandé)
```bash
# Push un commit et Netlify va auto-déployer
git add .
git commit -m "deploy: production launch"
git push origin main
```

Netlify va automatiquement:
1. Builder ton app
2. Lancer les tests (si y'en a)
3. Déployer sur production

### Option B : Manual Deploy dans Netlify UI
1. **Deploys** → **Trigger deploy** → **Deploy site**

---

## **ÉTAPE 8 : Vérification**

Après le deploy:

```bash
# Ouvre ton site
https://your-site-name.netlify.app

# Test les flows clés:
# 1. Signup → check email → verify
# 2. Login → voir dashboard
# 3. Créer un projet → upload image Cloudinary
# 4. Voir les projets sur Marketplace
```

**Check les logs :**
- **Netlify** → **Deploys** → Cliquer sur ton deploy → **Deploy log**
- **Supabase** → **Logs** pour les erreurs DB
- **Cloudinary** → **Media Library** pour vérifier les uploads

---

## **ÉTAPE 9 : Setup Custom Domain (Optionnel)**

Si tu achètes un domaine:

1. **Netlify** → **Settings** → **Domain management**
2. **Add custom domain** → Insérer ton domaine
3. Netlify va te donner les DNS records à configurer chez ton registrar
4. Configure les DNS records
5. HTTPS sera auto-configuré par Netlify (Let's Encrypt free)

---

## **TROUBLESHOOTING**

### ❌ Build échoue
```
Check: 
- npm run build (fonctionne localement ?)
- Les env vars sont toutes presentes ?
- Pas de import errors ?
```

### ❌ Erreur 401/406 Supabase
```
Solution: 
- Vérifier les RLS policies (étape 0)
- Vérifier VITE_SUPABASE_ANON_KEY dans Netlify env
- Check les Redirect URLs dans Supabase
```

### ❌ Cloudinary uploads fail
```
Check:
- VITE_CLOUDINARY_UPLOAD_PRESET = "kpon_upload" (unsigned preset)
- VITE_CLOUDINARY_CLOUD_NAME correct
```

### ❌ Email confirmation not working
```
Solution:
- Vérifier "Confirm email" activé dans Supabase
- Vérifier Redirect URL dans Supabase Email auth
- Check spam folder
```

---

## **MONITORING EN PRODUCTION**

### Analytics
- **Netlify Analytics** : Peux activer pour voir le traffic
- **Supabase Analytics** : Voir les requêtes DB

### Error Tracking
- **Sentry** : Tous les errors front-end sont captés automatiquement
- **Supabase Logs** : Database queries + auth events

### Performance
- **Netlify** : Donne un score Lighthouse automatique
- **WebPageTest** : Teste la perf

---

## **PROCHAINES ÉTAPES**

1. ✅ Déployer en production
2. ⏭️ Setup les webhooks Supabase (pour emails de confirmation)
3. ⏭️ Configurer FedaPay pour payments
4. ⏭️ Setup CI/CD avec tests automatiques
5. ⏭️ Configurer un domaine personnalisé

---

Bon déploiement! 🎉
2. Vérifier les DNS records
3. Attendre la propagation DNS (~24h)

### 5. HTTPS

Vercel génère automatiquement un certificat SSL Let's Encrypt

## 📊 Monitoring

### Vercel Analytics

- Performance metrics
- Web Vitals
- RUM (Real User Monitoring)

```bash
# Intégré automatiquement
```

### Erreurs

Vercel capture les erreurs automatiquement dans le dashboard.

Ajouter Sentry pour plus de détails :

```env
VITE_SENTRY_DSN=your_sentry_dsn
```

## 🔄 Pipeline CI/CD

### Triggers

- ✅ PR créée → Deploy preview
- ✅ PR approbée → Deploy production (après merge)
- ✅ Push sur main → Deploy production automatique

### Status Checks

```
✅ Lint pass
✅ Tests pass
✅ Build success
✅ Security checks pass
```

## 🐛 Troubleshooting

### Build échoue

1. Vérifier les logs Vercel
2. Vérifier que `bun run build` passe localement
3. Vérifier les variables d'environnement

### Erreur 404 après déploiement

Vérifier que le routing est configuré pour SPA:

Settings → Functions → Framework Preset : **Vite**

## 🔑 Secrets GitHub

Pour le workflow GitHub Actions:

1. Aller à Settings → Secrets → Actions
2. Ajouter:

```
VERCEL_TOKEN=<your_vercel_token>
VERCEL_ORG_ID=<your_org_id>
VERCEL_PROJECT_ID=<your_project_id>
SLACK_WEBHOOK=<optional_slack_webhook>
```

Obtenir les tokens:
- [VERCEL_TOKEN](https://vercel.com/account/tokens)
- [ORG_ID et PROJECT_ID](https://vercel.com/docs/deployments/deploy-button#environment-variables)

---

**Besoin d'aide ?** Consulter la [doc Vercel](https://vercel.com/docs)
