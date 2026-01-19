# 📚 Documentation - RAW STUDIO

## Bienvenue sur RAW STUDIO! 🎨

Un portfolio minimaliste & premium entièrement fonctionnel.

---

## 🎯 Qui suis-je?

Je suis **RAW STUDIO**, ton portfolio créatif minimaliste.

Je combine:
- ✨ **Design épuré** (comme Vanta, DonProd, Mario Roudil)
- 🔐 **Authentification sécurisée** (JWT + bcryptjs)
- 📊 **Base de données** (Prisma + SQLite/PostgreSQL)
- ⚡ **Performance optimale** (Next.js 16)
- 🎨 **Interface minimaliste** (Tailwind CSS 4)

---

## 🚀 Démarrer en 5 minutes

```bash
# 1. Installer les dépendances
npm install

# 2. Initialiser la base de données
npx prisma migrate dev --name init

# 3. Lancer le serveur
npm run dev

# 4. Ouvrir le navigateur
# → http://localhost:3000
```

**Ça y est!** Le site est live avec des données de test.

---

## 🔑 Identifiants de test

| Champ | Valeur |
|-------|--------|
| **URL** | http://localhost:3000/login |
| **Password** | `admin123` |
| **Role** | ADMIN |

---

## 🗺️ Navigation

### Pages publiques
| Route | Description |
|-------|-------------|
| `/` | Accueil + Galerie de projets |
| `/login` | Formulaire de connexion |
| `/projects/[slug]` | Page détail d'un projet |

### Pages protégées (Admin)
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard + Liste projets |
| `/admin/projects/new` | Créer un nouveau projet |
| `/admin/projects/[id]` | Éditer un projet |

---

## 🎨 Design & Esthétique

### Inspirations
1. **Vanta.tv** → Backgrounds immersifs et modernes
2. **DonProd.uk** → Minimalisme avec boldness
3. **Mario Roudil** → Typographie expressive

### Principes appliqués
```
✅ Ultra-minimaliste
✅ Espaces généreux (whitespace)
✅ Typographie forte (Inter)
✅ Focus sur les projets
✅ Animations subtiles
✅ Navigation fluide
✅ Pas d'éléments décoratifs inutiles
```

### Palette de couleurs
```css
--background: #ffffff   /* Blanc pur */
--foreground: #000000   /* Noir charbon */
--muted:      #666666   /* Gris moyen */
--border:     #e5e5e5   /* Gris très clair */
```

---

## 🛠️ Tech Stack

```
Frontend:     Next.js 16 + React 19
UI:           Tailwind CSS 4
Animations:   Framer Motion
Backend:      Next.js API Routes
Database:     Prisma 5 + SQLite/PostgreSQL
Auth:         JWT (jose) + bcryptjs
Hosting:      Vercel (recommandé)
```

---

## 📊 Structure des données

### Model: Project
```javascript
{
  id: "cuid",              // Unique identifier
  title: "string",         // Project name
  slug: "string",          // URL-friendly (unique)
  shortDesc: "string",     // 1-2 lines
  longDesc: "string",      // Full description
  images: "string",        // JSON array de URLs
  videos: "string",        // JSON array (optional)
  technologies: "string",  // JSON array des techs
  externalLink: "string",  // Link to live site
  featured: boolean,       // Pin as featured?
  displayOrder: number,    // Sort order
  createdAt: Date,
  updatedAt: Date
}
```

### Model: AccessKey
```javascript
{
  id: "cuid",
  value: "string",         // bcrypt hashed password
  role: "ADMIN|USER",      // User role
  expiresAt: Date,         // Optional expiration
  isActive: boolean,       // Active/Inactive
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Routes

### Authentication
```
POST /api/auth/login
  Request:  { password: "admin123" }
  Response: { success: true, role: "ADMIN" }

POST /api/auth/logout
  Response: { success: true }
```

### Projects
```
GET  /api/projects
  Response: [ { ...project1 }, { ...project2 }, ... ]

POST /api/projects
  Request:  { title, slug, shortDesc, ... }
  Response: { ...newProject }

GET  /api/projects/[id]
  Response: { ...project }

PUT  /api/projects/[id]
  Request:  { ...updates }
  Response: { ...updatedProject }

DELETE /api/projects/[id]
  Response: { success: true }
```

---

## 🎬 Ajouter votre premier projet

### Via l'interface admin
1. Connectez-vous: **http://localhost:3000/login**
2. Password: **admin123**
3. Cliquez sur **"+ New Project"**
4. Remplissez le formulaire:
   - **Title**: Nom du projet
   - **Slug**: URL-friendly (auto-généré)
   - **Short Desc**: Courte description
   - **Long Desc**: Description complète
   - **Images**: URLs (une par ligne)
   - **Technologies**: Tech stack (séparé par des virgules)
   - **External Link**: URL du site live (optionnel)
   - **Featured**: Marquer en vedette
5. Cliquez **"Create Project"**
6. Vu sur `/projects/[slug]` ✨

### Via l'API (curl)
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=your_jwt_token" \
  -d '{
    "title": "Mon incroyable projet",
    "slug": "mon-projet",
    "shortDesc": "Description courte",
    "longDesc": "Description longue et détaillée...",
    "images": "[\"https://...\", \"https://...\"]",
    "technologies": "[\"React\", \"Next.js\", \"Tailwind\"]",
    "featured": true
  }'
```

---

## 🔐 Sécurité

### Authentification
1. User envoie password → POST /api/auth/login
2. API valide password contre bcrypt hashed values
3. JWT token créé (7 jours expiration)
4. Cookie HTTP-only stocké (JavaScript cannot access)
5. Middleware valide token sur routes protégées

### Bonnes pratiques appliquées
✅ Passwords hashés (bcryptjs, 10 salts)
✅ JWT stateless (scalable)
✅ HTTP-only cookies (XSS protection)
✅ Middleware validation (CSRF protection)
✅ Pas de password en DB (seulement hash)
✅ Expiration tokens (7 jours)

---

## 🚀 Déploiement

### Sur Vercel (Recommandé) - 1 minute

```bash
# 1. Prepare repository
git add .
git commit -m "RAW Studio: Initial commit"
git push origin main

# 2. Connect Vercel
# - Visit vercel.com
# - Import your GitHub repo
# - Add environment variables:
#   - DATABASE_URL: postgresql://...
#   - JWT_SECRET: your-long-random-secret
# - Deploy!
```

### Sur Netlify
```bash
# Build
npm run build

# Deploy
# Deploy the `/out` folder to Netlify
# Add environment variables
```

### Environment variables (Production)
```env
# Production database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/raw_studio"

# Strong JWT secret
JWT_SECRET="your-very-long-and-random-secret-string-here"

# Environment
NODE_ENV="production"
```

---

## 🎨 Customization

### Changer le titre/logo
Modifiez `src/components/Navbar.jsx`:
```jsx
<Link href="/" className="text-2xl font-bold tracking-tight">
  MON STUDIO  {/* ← Changez ici */}
</Link>
```

### Changer la couleur d'accent
Modifiez `src/app/globals.css`:
```css
:root {
  --foreground: #your-color;
}
```

### Ajouter une page
1. Créez `src/app/my-page/page.jsx`
2. Importez `Navbar`
3. Créez votre contenu
4. Ajoutez le lien dans `Navbar.jsx`

### Ajouter des animations
```jsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Your content
</motion.div>
```

---

## 📝 Commandes utiles

```bash
# Développement
npm run dev              # Lancer le serveur dev

# Build & Production
npm run build            # Build for production
npm start                # Run production build

# Database
npx prisma migrate dev   # Create & apply migrations
npx prisma db seed      # Run seeding script
npx prisma studio      # Open Prisma Studio (GUI)

# Linting
npm run lint             # Run ESLint

# Database reset (dev only!)
rm prisma/dev.db && npm run dev
```

---

## 🐛 Troubleshooting

### "Database is locked"
```bash
rm prisma/dev.db*
npx prisma migrate dev --name init
npm run dev
```

### "Module not found: jose"
```bash
npm install jose
```

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
# or kill the process
lsof -ti:3000 | xargs kill -9
```

### "Authentication fails"
1. Vérifiez que `.env` existe
2. Vérifiez que `DATABASE_URL` est correct
3. Reset la DB: `rm prisma/dev.db`
4. Re-seed: `npx prisma migrate dev`

---

## 🔗 Ressources

- **Next.js Docs**: https://nextjs.org/docs
- **React 19**: https://react.dev
- **Prisma ORM**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion
- **jose JWT**: https://github.com/panva/jose

---

## 📞 Support

### Besoin d'aide?
- 📖 Lisez cette documentation
- 🔍 Consultez [GETTING_STARTED.md](./GETTING_STARTED.md)
- 🛣️ Vérifiez [API Routes](#-api-routes)
- 💾 Analysez [prisma/schema.prisma](./prisma/schema.prisma)

---

**Bon développement! 🚀**

*RAW STUDIO est prêt à être votre portfolio professionnel.*
