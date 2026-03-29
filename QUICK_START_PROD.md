# 🚀 QUICK START - Production Deployment (10 min)

## **7 ÉTAPES SEULEMENT**

---

### **ÉTAPE 1️⃣ : Fix Database Policies (2 min)**

Copie ce SQL dans **Supabase Dashboard → SQL Editor** :

```sql
DROP POLICY IF EXISTS "Users can insert themselves" ON users;
CREATE POLICY "Users can insert themselves" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users are public" ON users;
CREATE POLICY "Users are public" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update themselves" ON users;
CREATE POLICY "Users can update themselves" ON users FOR UPDATE USING (auth.uid()::text = id::text) WITH CHECK (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Projects are public" ON projects;
CREATE POLICY "Projects are public" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create projects" ON projects;
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid()::text = designer_id::text);

DROP POLICY IF EXISTS "Designers can update own" ON projects;
CREATE POLICY "Designers can update own" ON projects FOR UPDATE USING (auth.uid()::text = designer_id::text) WITH CHECK (auth.uid()::text = designer_id::text);

DROP POLICY IF EXISTS "Designers can delete own" ON projects;
CREATE POLICY "Designers can delete own" ON projects FOR DELETE USING (auth.uid()::text = designer_id::text);
```

✅ Clique **Run**

---

### **ÉTAPE 2️⃣ : Push à GitHub (1 min)**

```bash
cd ~/Desktop/MIDEESSI/kpon/kpon
git add .
git commit -m "chore: prepare for production"
git push origin main
```

---

### **ÉTAPE 3️⃣ : Connect Netlify (2 min)**

1. Va sur [netlify.com](https://netlify.com)
2. **Sign up** → **Continue with GitHub**
3. Authorize Netlify
4. **Add new site** → **Import an existing project**
5. Sélectionne **GitHub**
6. Trouve `kpon` → Clique
7. Configure:
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`
   - Laisse les autres par défaut
8. Clique **Deploy site**

Attends que Netlify te donne ton URL (ressemble à: `random-name-12345.netlify.app`)

---

### **ÉTAPE 4️⃣ : Configure Environment Variables (2 min)**

Regarde ton site Netlify → **Settings** → **Build & Deploy** → **Environment** → **Add environment variables**

Ajoute ces variables (une par une):

```
VITE_SUPABASE_URL = https://ubihpicbcftmhmtlcogz.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViaWhwaWNiY2Z0bWhtdGxjb2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTc2NjUsImV4cCI6MjA5MDM3MzY2NX0.OAg1Q6R8zZWC8c8z5q4dArwDZNbXsJQryVP6qIOeX4A
VITE_CLOUDINARY_CLOUD_NAME = dnvul9kes
VITE_CLOUDINARY_UPLOAD_PRESET = kpon_upload
VITE_CLOUDINARY_API_KEY = 333234767672453
```

✅ Clique **Save**

Trigger manual deploy:
- **Deploys** → **Trigger deploy** → **Deploy site**

---

### **ÉTAPE 5️⃣ : Configure Supabase Redirect URLs (1 min)**

**Supabase Dashboard** → **Authentication** (left menu) → **URL Configuration**

**Site URL**: 
```
https://YOUR-NETLIFY-DOMAIN.netlify.app
```
(Remplace `YOUR-NETLIFY-DOMAIN` par celui que Netlify t'a donné)

**Additional Redirect URLs** → Ajoute ces 2:
```
https://YOUR-NETLIFY-DOMAIN.netlify.app/auth/callback
https://YOUR-NETLIFY-DOMAIN.netlify.app/dashboard
```

✅ Clique **Save**

---

### **ÉTAPE 6️⃣ : Test Everything (1 min)**

Ouvre ton site : `https://YOUR-NETLIFY-DOMAIN.netlify.app`

Test:
- ✅ Homepage charge (pas d'erreur)
- ✅ Signup → email reçu → lien marche → profile créé
- ✅ Login → see dashboard
- ✅ Upload project → voir sur marketplace
- ✅ Open DevTools (F12) → No red errors in console

---

### **ÉTAPE 7️⃣ : Custom Domain (OPTIONNEL - 5 min)**

Si tu veux un domaine personnalisé (ex: kpon.com):

1. Achète un domaine (GoDaddy, Namecheap, etc.)
2. Netlify → **Settings** → **Domain management** → **Add custom domain**
3. Insère ton domaine
4. Netlify va te donner les nameservers DNS
5. Chez ton registrar, change les nameservers vers ceux de Netlify
6. Attends 15-30 min pour que le DNS se propage
7. HTTPS automatique! ✅

---

## ✅ **DONE! Tu es en production!**

### Next Steps:
1. Share ton URL avec des amis
2. Test thoroughly en production
3. Monitor errors dans Sentry dashboard
4. Setup payments si tu veux (FedaPay)

### Important Notes:
- 🔒 Ne push JAMAIS ton `.env` file
- 📊 Check les logs sur Netlify si quelque chose échoue
- 🆘 Si signup échoue → Vérifie les RLS policies ont été exécutées
- 🔑 Garde tes credentials (Supabase keys) secrets!

---

**Questions?** Lire le guide complet: [DEPLOYMENT.md](./DEPLOYMENT.md)

Bon courage! 🎉
