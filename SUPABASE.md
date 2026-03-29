# Configuration Supabase pour KPON

## 🚀 Setup Supabase (5 minutes)

### Étape 1: Créer un compte Supabase

1. Accédez à [supabase.com](https://supabase.com)
2. Cliquez **Sign Up** (via GitHub c'est plus rapide)
3. Confirmez votre email

### Étape 2: Créer un nouveau projet

1. Cliquez **New Project**
2. Remplis :
   - **Project name** : `kpon`
   - **Database password** : Génère un mot de passe fort (important !)
   - **Region** : `eu-west-1` ou la plus proche de toi
   - **Pricing** : Free tier ✅
3. Clique **Create new project** (attends 1-2 min)

### Étape 3: Récupérer tes identifiants

1. Une fois prêt, va **Settings** (gear icon haut droite) → **API**
2. Tu verras :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **Anon Public Key** : Copie-la
   - **Service Role Key** : Copie-la aussi (secret !)

### Étape 4: Remplir le `.env`

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### Étape 5: Créer les tables

1. Va **SQL Editor** dans le dashboard Supabase
2. Clique **+ New Query**
3. **Copie-colle le code SQL ci-dessous complètement**
4. Clique **Run** (doit dire "Success")

## 📊 SQL : Créer les tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'freelancer',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  file_url TEXT NOT NULL,
  file_size TEXT,
  file_type TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  designer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_projects_designer_id ON projects(designer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- ============================================
-- 3. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_reviews_project_id ON reviews(project_id);
CREATE INDEX idx_reviews_buyer_id ON reviews(buyer_id);

-- ============================================
-- 4. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT UNIQUE NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'XOF',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_payments_project_id ON payments(project_id);
CREATE INDEX idx_payments_buyer_id ON payments(buyer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- ============================================
-- 5. CART_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(buyer_id, project_id)
);

CREATE INDEX idx_cart_items_buyer_id ON cart_items(buyer_id);

-- ============================================
-- 6. FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, project_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- USERS: Publique en read, chacun son update
CREATE POLICY "Users are public" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update themselves" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- PROJECTS: Publique en read
CREATE POLICY "Projects are public" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid()::text = designer_id::text);
CREATE POLICY "Designers can update own" ON projects FOR UPDATE USING (auth.uid()::text = designer_id::text);

-- REVIEWS: Publique en read
CREATE POLICY "Reviews are public" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own review" ON reviews FOR INSERT WITH CHECK (auth.uid()::text = buyer_id::text);

-- PAYMENTS: Privé (voir que tes propres)
CREATE POLICY "Users see own payments" ON payments FOR SELECT USING (auth.uid()::text = buyer_id::text);

-- CART: Privé (chacun son panier)
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid()::text = buyer_id::text);

-- FAVORITES: Privé (chacun ses favoris)
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (auth.uid()::text = user_id::text);
```

## 🔧 Prochaines étapes

1. **Redémarre le serveur** : `bun dev`
2. Tu peux maintenant tester l'authentification
3. Les uploads Cloudinary + Supabase DB vont fonctionner ensemble

## 📚 Documentations

- [Supabase Docs](https://supabase.com/docs)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)


### Table: projects

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  price BIGINT NOT NULL, -- en CFA
  status VARCHAR DEFAULT 'active',
  file_url VARCHAR,
  file_size BIGINT,
  views INT DEFAULT 0,
  downloads INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: payments

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  client_phone VARCHAR NOT NULL,
  amount BIGINT NOT NULL,
  transaction_id VARCHAR UNIQUE,
  status VARCHAR DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: downloads

```sql
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  client_email VARCHAR NOT NULL,
  download_url VARCHAR,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentification

### Configurer Auth dans Supabase

1. Settings → Authentication
2. Configure providers (optionnel) :
   - Email/Password (défaut)
   - Google/GitHub (social login)
3. Redirect URLs :
   ```
   http://localhost:8080/auth/callback
   https://kpon.vercel.app/auth/callback
   ```

### Exemple d'utilisation

```typescript
// src/lib/services/supabase.auth.service.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}
```

## 📁 Storage (Fichiers)

### Créer des buckets

1. Storage → Create new bucket

Buckets recommandés:

```
projects/       # Fichiers de projets
previews/       # Aperçus/thumbnails
```

### Configuration

```typescript
// src/lib/services/storage.service.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(...);

export async function uploadFile(bucket: string, file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const { error, data } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  // Obtenir l'URL publique
  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
```

### Row-Level Security (RLS)

Para chaque table, configurer les policies:

**Pour projects** :

```sql
-- Lire tous les projets publics
CREATE POLICY "Select public projects"
  ON projects FOR SELECT
  USING (true);

-- Créer seulement si l'utilisateur est le designer
CREATE POLICY "Insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = designer_id);

-- Mettre à jour seulement ses propres projets
CREATE POLICY "Update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = designer_id);
```

## ⚡ Requêtes en Temps Réel

```typescript
// Écouter les changements en temps réel
supabase
  .from("projects")
  .on("*", (payload) => {
    console.log("Changement:", payload);
  })
  .subscribe();
```

## 🧪 Tests localement

### Émuler Supabase localement

```bash
# Installer Supabase CLI
npm install -g @supabase/cli

# Démarrer l'émulateur
supabase start

# Seed la base avec des données test
supabase db seed
```

## 🔄 Migrations

### Créer une migration

```bash
supabase migration new add_user_roles
```

Éditer `supabase/migrations/[timestamp]_add_user_roles.sql`

### Appliquer les migrations

```bash
supabase db push
```

## 📊 Monitoring et Logs

### Supabase Dashboard

- Logs → Edge Function logs
- Graphs → Performance metrics
- Database → Query inspector

## 🚀 Prod vs Dev

### Différences

| Feature | Dev | Production |
|---------|-----|------------|
| Backups | Auto daily | Auto hourly |
| IPs | Dynamic | Static |
| Uptime SLA | - | 99.99% |

### Configurer l'environnement

```env
# .env.development
VITE_SUPABASE_URL=https://dev.supabase.co
VITE_SUPABASE_ANON_KEY=dev_key

# .env.production
VITE_SUPABASE_URL=https://prod.supabase.co
VITE_SUPABASE_ANON_KEY=prod_key
```

## 🐛 Troubleshooting

### "CORS error"

Configurer les CORS dans Supabase :
Settings → API → CORS Headers

```
http://localhost:8080
https://kpon.vercel.app
```

### "Unauthorized" sur uploads

Vérifier RLS policies sont correctes

### "Rate limit exceeded"

Supabase free tier :
- 50k ops/month
- 1GB storage
- 5 seats

Upgrader si nécessaire

---

**Besoin d'aide ?** Consulter la [doc Supabase](https://supabase.com/docs)
