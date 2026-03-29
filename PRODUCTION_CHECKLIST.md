# ✅ Production Readiness Checklist

## **BEFORE DEPLOY**

### Database & Authentication
- [ ] SQL RLS Policies exécuté dans Supabase (FIX_RLS_POLICIES.sql)
- [ ] Supabase Email Confirmation activé (Authentication → Email)
- [ ] Supabase Redirect URLs configurées pour ton domaine Netlify
- [ ] Vérification que les tables users, projects existent
- [ ] Indexes créés sur projects(designer_id), projects(created_at)

### Cloudinary Setup
- [ ] Upload Preset créé en mode "Unsigned"
- [ ] Cloudinary CORS origins configuré pour Netlify domain
- [ ] Images test uploadent correctement

### Code Quality
- [ ] `npm run build` fonctionne sans erreurs
- [ ] `npm run lint` (pas de warnings critiques)
- [ ] `npm run test` (tous les tests passent)
- [ ] No console.errors/warnings en console
- [ ] .gitignore inclut `.env`, `.env.local`

### Environment Variables
- [ ] `.env.example` à jour avec tous les required vars
- [ ] Pas de credentials hardcodées dans le code
- [ ] Netlify env vars configurées pour prod
- [ ] VITE_SUPABASE_URL commence par `https://`
- [ ] VITE_CLOUDINARY_CLOUD_NAME n'est pas vide

### Security
- [ ] Supabase RLS policies restrictives (pas de règles `true` à tout va)
- [ ] No API keys exposées dans le frontend (sauf ANON_KEY)
- [ ] Headers de sécurité configurés (Cache-Control, X-Frame-Options, etc.)
- [ ] HTTPS activé (automatique sur Netlify)

### Performance
- [ ] Code splitting configuré dans vite.config.ts
- [ ] Images optimisées (via Cloudinary ou Unsplash)
- [ ] Build size < 500KB total
- [ ] React Lazy Loading sur routes

---

## **DURING DEPLOY**

### Netlify Setup
- [ ] GitHub repo connecté à Netlify
- [ ] `netlify.toml` est présent et configuré
- [ ] Build command: `bun run build` (ou npm/yarn)
- [ ] Publish directory: `dist`
- [ ] Env variables ajoutées dans Netlify dashboard
- [ ] Deploy trigger depuis main branch

### Supabase Configuration
- [ ] Site URL = Netlify domain (https://your-site.netlify.app)
- [ ] Redirect URLs include `/auth/callback` endpoint
- [ ] JWT tokens configured correctly
- [ ] Database backups enabled (auto)

---

## **AFTER DEPLOY**

### Functional Tests
- [ ] Homepage charge (pas une erreur 404)
- [ ] Signup flow works end-to-end
  - [ ] Email envoyé pour confirmation
  - [ ] Lien de confirmation redirige correctly
  - [ ] Profile créé dans Supabase users table
- [ ] Login flow works
- [ ] Dashboard charge après login
- [ ] Marketplace affiche les projets
- [ ] New Project form works
  - [ ] File upload vers Cloudinary
  - [ ] Project créé dans Supabase projects table
- [ ] Project Detail page loads
- [ ] Logout works

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile (iOS Safari, Chrome Mobile)

### Monitoring
- [ ] Sentry integration working (check sentry.io dashboard)
- [ ] Netlify Analytics visible
- [ ] No 404 errors in deploy log
- [ ] No environment variable warnings

### DNS & Domain (if custom domain)
- [ ] DNS records pointing to Netlify
- [ ] HTTPS working (green lock)
- [ ] Redirects www → non-www working
- [ ] Email deliverability from Supabase

### Backup & Disaster Recovery
- [ ] Supabase daily backups enabled
- [ ] Database export created + stored safely
- [ ] Git repo backed up
- [ ] Credentials stored safely (LastPass, 1Password, etc.)

---

## **OPTIONAL ENHANCEMENTS**

### SEO
- [ ] Meta titles/descriptions set
- [ ] Open Graph tags for sharing
- [ ] robots.txt configured
- [ ] Sitemap.xml available

### Analytics
- [ ] Google Analytics setup
- [ ] Hotjar or similar for user behavior
- [ ] Database query performance monitored

### Email
- [ ] Supabase email templates customized
- [ ] SendGrid or similar for transactional emails (optional)
- [ ] Email unsubscribe links working

### Payment (if launching with payments)
- [ ] FedaPay account created
- [ ] FedaPay keys added to env vars
- [ ] Test payments working
- [ ] Webhook for payment confirmations setup

---

## **PRODUCTION SUPPORT CHECKLIST**

- [ ] Slack/Email alerts setup for errors (Sentry)
- [ ] Database monitoring enabled (Supabase)
- [ ] Uptime monitoring (UptimeRobot or similar)
- [ ] Support email configured
- [ ] Incident response plan documented
- [ ] Team has access to Netlify & Supabase dashboards

---

## **Quick Rollback Plan**

If something breaks in production:

1. **Frontend Issue** → Netlify → Deploys → Click previous deploy → "Publish deploy"
2. **Database Issue** → Supabase → Database → Backups → Restore (takes 24h, so this is last resort)
3. **Env Vars Issue** → Netlify → Settings → Env vars → Fix → Redeploy

---

Done! ✅ When all items checked, you're production-ready! 🚀
