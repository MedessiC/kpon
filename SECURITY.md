# 🔒 Production Security Checklist

## **BEFORE GOING PUBLIC**

### Environment & Credentials
- [ ] ✅ `.env` files NEVER pushed to GitHub (check .gitignore)
- [ ] ✅ All secrets stored in Netlify env variables, NOT in code
- [ ] ✅ `VITE_SUPABASE_ANON_KEY` is OK to expose (it's the public key)
- [ ] ✅ `SUPABASE_SERVICE_KEY` is NEVER used in frontend (backend only)
- [ ] ✅ API keys rotated regularly
- [ ] ✅ `.env.example` updated but contains DUMMY values

### Supabase Security
- [ ] ✅ RLS (Row Level Security) is ENABLED on ALL tables
- [ ] ✅ RLS policies are RESTRICTIVE (not just `true` for everything)
- [ ] ✅ Users can only see their own data (payments, cart, favorites)
- [ ] ✅ Only authenticated users can insert projects
- [ ] ✅ Designers can only update/delete their own projects
- [ ] ✅ Email confirmation required for signup
- [ ] ✅ Password requirements enforced (min 6 chars)
- [ ] ✅ JWT tokens have reasonable expiration (default 1 hour)

### Cloudinary Security
- [ ] ✅ Upload preset is UNSIGNED (no backend needed)
- [ ] ✅ Upload preset has transformations limits set
- [ ] ✅ CORS properly configured for your domain only
- [ ] ✅ API Key is NOT used in frontend for unsigned uploads
- [ ] ✅ No HTML/JS file types allowed in uploads

### Frontend Security
- [ ] ✅ No credentials hardcoded in JavaScript
- [ ] ✅ No API endpoints hardcoded (use env vars)
- [ ] ✅ CORS headers properly configured
- [ ] ✅ Content Security Policy headers set
- [ ] ✅ HTTP headers prevent common attacks:
  - `X-Frame-Options: SAMEORIGIN` (prevent clickjacking)
  - `X-Content-Type-Options: nosniff` (prevent MIME sniffing)
  - `X-XSS-Protection: 1; mode=block` (older XSS protection)
  - `Cache-Control` appropriate for each route

### Netlify Security
- [ ] ✅ Only `main` branch deploys to production
- [ ] ✅ Netlify access limited to trusted team members
- [ ] ✅ Deploy previews don't expose secrets
- [ ] ✅ HTTPS enabled (automatic with Netlify)
- [ ] ✅ Netlify DDoS protection enabled

### Code Quality
- [ ] ✅ No `console.log()` with sensitive data
- [ ] ✅ No API URLs hardcoded
- [ ] ✅ Error messages don't expose internal details
- [ ] ✅ Input validation + sanitization on all forms
- [ ] ✅ No SQL injection possible (using Supabase ORM)
- [ ] ✅ No XSS vulnerabilities (React escapes by default)

### Monitoring & Alerts
- [ ] ✅ Sentry configured for error tracking
- [ ] ✅ Sentry alerts enabled for new errors
- [ ] ✅ Database backups enabled in Supabase (daily)
- [ ] ✅ Uptime monitoring configured (UptimeRobot or Netlify Analytics)
- [ ] ✅ Logs being monitored (Supabase Dashboard)

### Data Protection
- [ ] ✅ User passwords hashed by Supabase (bcrypt)
- [ ] ✅ Sensitive data NOT stored unencrypted (email is OK)
- [ ] ✅ GDPR compliance considered (if EU users)
- [ ] ✅ Privacy policy available
- [ ] ✅ Terms of Service available
- [ ] ✅ Cookie consent implemented (if needed)

---

## **PRODUCTION-ONLY HARDENING**

### Add these to `netlify.toml` headers:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.sentry-cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://ubihpicbcftmhmtlcogz.supabase.co https://upload.cloudinary.com https://api.sentry.io; frame-ancestors 'self'"
```

Already configured in your `netlify.toml` ✅

---

## **ONGOING SECURITY PRACTICES**

### Monthly Tasks:
- [ ] Check Sentry for new errors patterns
- [ ] Review Supabase logs for suspicious activity
- [ ] Audit RLS policies (any changes needed?)
- [ ] Check Cloudinary for unexpected files

### Quarterly Tasks:
- [ ] Rotate API keys/secrets
- [ ] Review team access (Netlify, Supabase)
- [ ] Test disaster recovery procedure
- [ ] Security audit of new features

### Annually:
- [ ] Security penetration testing
- [ ] Dependency audit (npm audit)
- [ ] Compliance review (GDPR, etc.)

---

## **INCIDENT RESPONSE**

In case of a security breach:

1. **If frontend compromised**: 
   - Redeploy previous version on Netlify
   - Audit code changes
   - Rotate Supabase keys

2. **If data leaked**:
   - Take backup of current state
   - Disable affected user accounts
   - Notify users
   - Check database access logs

3. **If DDoS attack**:
   - Netlify handles automatically (DDoS protection)
   - Monitor Netlify dashboard
   - Scale up if needed

---

## **AUDIT TRAIL**

Keep records of:
- ✅ All deployments (Netlify shows this)
- ✅ All database backups (Supabase shows this)
- ✅ All API key rotations (documentation)
- ✅ All security incidents (incident log)

---

**Security = Ongoing Process** - Review this checklist before each major update! ✅
