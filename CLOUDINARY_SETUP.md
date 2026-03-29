# Configuration Cloudinary pour KPON

## 🚀 Setup Cloudinary

### 1. Créer un compte Cloudinary

1. Accédez à [cloudinary.com](https://cloudinary.com)
2. Cliquez sur **Sign Up** et créez un compte gratuit
3. Confirmez votre email

### 2. Récupérer vos identifiants

1. Allez sur le **Dashboard** de Cloudinary
2. Vous verrez votre **Cloud Name** en haut
3. Vous aurez aussi votre **API Key** et **API Secret** visibles

### 3. Créer un Upload Preset

Un "Upload Preset" permet les uploads sans authentification API (plus sécurisé client-side).

**Étapes :**

1. Allez à **Settings** → **Upload** (dans le menu de gauche)
2. Descendez jusqu'à **Upload presets**
3. Cliquez sur **Add upload preset**
4. Configurez :
   - **Preset name** : `kpon_upload` (ou le nom que tu veux)
   - **Unsigned** : `ON` ✅ (très important pour les uploads client-side)
   - **Folder** : `kpon/projects` (optionnel, for organization)
5. Cliquez sur **Save**
6. Copie le **Preset name** que tu viens de créer

### 4. Remplir le fichier `.env`

Ouvre `.env` dans ton projet et remplace les valeurs :

```env
VITE_CLOUDINARY_CLOUD_NAME=ton_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=kpon_upload
VITE_CLOUDINARY_API_KEY=ton_api_key
```

**Exemple :**
```env
VITE_CLOUDINARY_CLOUD_NAME=dxabcdef1
VITE_CLOUDINARY_UPLOAD_PRESET=kpon_upload
VITE_CLOUDINARY_API_KEY=123456789
```

### 5. Redémarre le serveur dev

```bash
bun dev
```

## ✅ Tester l'upload

1. Va sur `/new-project` (page de création de projet)
2. Remplis le formulaire
3. Sélectionne un fichier ZIP ou image
4. Clique sur **Créer le projet**
5. Le fichier devrait être uploadé sur Cloudinary 🎉

## 📋 Structure de l'intégration Cloudinary

### Service (`src/lib/services/cloudinary.service.ts`)

- `uploadFile(file, options)` - Upload un fichier
- `uploadMultiple(files, options)` - Upload plusieurs fichiers
- `getSecureUrl(publicId)` - Récupère l'URL sécurisée
- `getOptimizedUrl(publicId, width, height)` - URL optimisée avec dimensions

### Hook (`src/hooks/useCloudinaryUpload.ts`)

```typescript
const { uploadFile, isLoading, error, progress } = useCloudinaryUpload();

// Utilisation
const response = await uploadFile(file);
console.log(response.secure_url); // URL du fichier uploadé
```

### Utilisation dans NewProject

```typescript
const uploadResponse = await uploadFile(file);
// uploadResponse contient:
// - public_id: identifiant unique du fichier
// - secure_url: URL HTTPS sécurisée
// - url: URL HTTP
// - size: taille du fichier
// - created_at: timestamp
```

## 🔒 Sécurité

- ✅ Les uploads sont **non signés** (unsigned) - pas d'API key exposé
- ✅ L'Upload Preset contrôle quels types de fichiers sont acceptés
- ✅ Tu peux limiter le dossier de destination dans le preset
- ✅ Les identifiants sont dans `.env` (jamais commiter `.env` !)

## 🎯 Limites du plan gratuit Cloudinary

- 25 GB de stockage
- 25 crédits de transformation par mois
- Uploads illimités ✅
- Bande passante généreuse

## ❓ Questions fréquentes

**Q: Où les fichiers sont stockés ?**  
R: Sur les serveurs Cloudinary (CDN global, ultra-fast).

**Q: Comment je récupère l'URL du fichier uploadé ?**  
R: La réponse de upload contient `secure_url` - c'est l'URL publique.

**Q: Je peux transformer les images ?**  
R: Oui ! Avec `getOptimizedUrl()` ou en ajoutant des paramètres Cloudinary à l'URL.

**Q: Comment je liste les fichiers uploadés ?**  
R: Via le dashboard Cloudinary → Media Library, ou avec l'API Cloudinary.

## 📚 Documentation

- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Upload API Docs](https://cloudinary.com/documentation/upload_widget)
- [Transformations](https://cloudinary.com/documentation/image_transformations)
