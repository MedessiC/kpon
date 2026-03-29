# Fix Supabase Signup Issues

## 🔴 Problèmes détectés

1. **401 Unauthorized** sur `/rest/v1/users` → RLS policies bloquent l'insert au signup
2. **Email de confirmation** redirige vers `localhost` → Redirect URLs non configurées
3. **429 Too Many Requests** → Rate limiting normal de Supabase (continue juste les tests)

---

## ✅ Solution 1 : Fixer les RLS Policies (5 min)

### Étapes:
1. Va sur **Supabase Dashboard** → **SQL Editor**
2. Crée une **New Query**
3. Copy-paste tout le contenu du fichier `FIX_RLS_POLICIES.sql` 
4. Clique **Run**

**Résultat attendu:** Pas d'erreur, message "X queries executed successfully"

---

## ✅ Solution 2 : Configurer Redirect URLs (3 min)

### Étapes:
1. **Supabase Dashboard** → **Authentication** (menu gauche)
2. Clique sur **URL Configuration**
3. **Site URL:** `http://localhost:8080`
4. **Additional Redirect URLs**, ajoute:
   ```
   http://localhost:8080/auth/callback
   http://localhost:8080/dashboard
   ```
5. Clique **Save**

---

## ✅ Solution 3 : Tester le flux (2 min)

### Testez:
1. Allez sur `http://localhost:8080/auth`
2. Cliquez **Sign Up**
3. Entrez email + password + nom
4. Vous devriez recevoir un email de confirmation
5. Cliquez le lien dans l'email
6. **Vous serez redirigé vers `/auth/callback`** qui vous envoie au dashboard

---

## 🔧 Tech Details

**Nouvelle page:** `src/pages/AuthCallback.tsx`
- Gère la confirmation email
- Valide le session
- Redirige vers `/dashboard`

**Nouvelle route:** `GET /auth/callback`
- Ajoutée à `App.tsx`
- Intercepte le lien de confirmation

**Policies RLS mises à jour:**
- ✅ Permet aux users de s'insérer eux-mêmes (signup)
- ✅ Permet les lectures publiques des profils
- ✅ Permet les updates/deletes du propre profil
- ✅ Appliqué à toutes les tables

---

## 📋 Checklist avant le prochain test

- [ ] RLS policies exécutées (`FIX_RLS_POLICIES.sql`)
- [ ] URL Configuration sauvegardée
- [ ] Dev server redémarré (`npm run dev`)
- [ ] Cache vidé du navigateur (Ctrl+Shift+Delete)
- [ ] Nouveau compte de test créé
