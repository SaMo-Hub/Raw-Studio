# 🎨 RAW STUDIO - Portfolio Minimaliste Premium

Bienvenue dans **RAW STUDIO**, un portfolio créatif minimaliste et premium, entièrement fonctionnel et prêt à personnaliser.

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
cd raw-studio
npm install
```

### 2. Initialiser la base de données
```bash
npx prisma migrate dev --name init
```

Cela va :
- ✅ Créer la base SQLite
- ✅ Appliquer les migrations
- ✅ Seeder la DB avec des données de test
- ✅ Créer un compte admin (password: `admin123`)

### 3. Lancer le serveur
```bash
npm run dev
```

Visite: **http://localhost:3000**

---

## 🎯 Architecture & Fonctionnalités

### 📁 Structure du projet

```
raw-studio/
├── src/
│   ├── app/
│   │   ├── api/                  # Routes API
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── logout/
│   │   │   └── projects/
│   │   │
│   │   ├── admin/                # Back-office (protégé)
│   │   │   └── projects/
│   │   │       ├── new/
│   │   │       └── [id]/
│   │   │
│   │   ├── login/                # Page login
│   │   └── page.js               # Accueil
│   │
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   ├── lib/
│   │   ├── auth.ts               # Auth & JWT
│   │   ├── db.ts                 # Prisma client
│   │   └── utils.ts              # Utilitaires
│   │
│   ├── middleware.ts             # Protection routes
│   └── globals.css               # Styles globaux
│
├── prisma/
│   ├── schema.prisma             # Modèles DB
│   ├── seed.js                   # Données initiales
│   └── dev.db                    # SQLite database
│
├── .env                          # Variables d'env
└── package.json
```

---

## 🔐 Authentification

### Identifiants de démo
- **URL**: http://localhost:3000/login
- **Password**: `admin123`

### Flux d'authentification
1. Utilisateur se connecte avec un mot de passe
2. Password est validé contre la base AccessKey
3. JWT token est créé et stocké en HTTP-only cookie
4. Redirection vers /admin (role ADMIN) ou home (role USER)

---

## 🛠️ API Routes

### Authentication
```
POST /api/auth/login       # Connexion
POST /api/auth/logout      # Déconnexion
```

### Projects
```
GET    /api/projects       # Lister tous les projets
POST   /api/projects       # Créer un projet
GET    /api/projects/[id]  # Détails d'un projet
PUT    /api/projects/[id]  # Modifier un projet
DELETE /api/projects/[id]  # Supprimer un projet
```

---

## 🎨 Design & Esthétique

### Inspirations
- **Vanta.tv** - Backgrounds immersifs
- **DonProd.uk** - Design minimaliste & bold
- **Mario Roudil** - Typographie expressive

### Principes de design
✅ Ultra-minimaliste
✅ Espaces généreux
✅ Typographie forte
✅ Focus sur les projets
✅ Animations subtiles
✅ Navigation fluide

### Couleurs
- Fond: **Blanc pur** (#ffffff)
- Texte: **Noir charbon** (#000000)
- Accents: **Gris** (#666666)
- Borders: **Gris léger** (#e5e5e5)

### Typographie
- Font: **Inter** (Google Fonts)
- H1: 3rem, font-weight 700
- Body: 1rem, line-height 1.6

---

## 📊 Modèles de données

### Project
```typescript
{
  id: string          // ID unique
  title: string       // Titre du projet
  slug: string        // URL-friendly slug (unique)
  shortDesc: string   // Description courte
  longDesc: string    // Description complète
  images: string      // JSON array de URLs
  videos?: string     // JSON array de vidéos (optionnel)
  technologies: string // JSON array de techs
  externalLink?: string // Lien externe
  featured: boolean   // En vedette?
  displayOrder: number // Ordre d'affichage
  createdAt: Date
  updatedAt: Date
}
```

### AccessKey (Auth)
```typescript
{
  id: string
  value: string       // Password (bcrypt hashed)
  role: string        // "ADMIN" ou "USER"
  expiresAt?: Date    // Expiration (optionnel)
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔄 Pages & Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Public | Accueil + galerie projets |
| `/login` | Public | Formulaire de connexion |
| `/projects/[slug]` | Public | Détail d'un projet |
| `/admin` | Protégé | Dashboard admin |
| `/admin/projects` | Protégé | Liste des projets |
| `/admin/projects/new` | Protégé | Créer un projet |
| `/admin/projects/[id]` | Protégé | Éditer un projet |

---

## 📝 Ajouter un projet

### Via l'interface admin
1. Connectez-vous: http://localhost:3000/login (admin123)
2. Allez à `/admin`
3. Cliquez "New Project"
4. Remplissez le formulaire:
   - Title
   - Slug (auto-généré)
   - Short Description
   - Long Description
   - Images URLs (une par ligne)
   - Technologies (séparées par des virgules)
   - Lien externe (optionnel)
   - Featured (checkbox)

5. Cliquez "Create Project"

### Via l'API (curl)
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "slug": "my-project",
    "shortDesc": "A cool project",
    "longDesc": "Longer description...",
    "images": ["https://..."],
    "technologies": ["React", "Next.js"],
    "featured": true
  }'
```

---

## 🎬 Prochaines étapes

### Phase 1: Customisation (Facile)
- [ ] Remplacer le logo & titre
- [ ] Ajouter vos projets
- [ ] Changer les couleurs
- [ ] Modifier le texte

### Phase 2: Améliorations (Moyen)
- [ ] Ajouter animations Framer Motion
- [ ] Upload d'images (not just URLs)
- [ ] Galerie d'images améliorée
- [ ] Dark mode
- [ ] SEO optimizations

### Phase 3: Avancé (Complexe)
- [ ] Blog avec articles
- [ ] Système de commentaires
- [ ] Analytics & tracking
- [ ] Newsletter signup
- [ ] Form de contact

---

## 🚀 Déploiement

### Sur Vercel (Recommandé)
```bash
# 1. Push vers GitHub
git add .
git commit -m "Initial commit: RAW Studio"
git push origin main

# 2. Sur Vercel.com
- Import repository
- Configure DATABASE_URL
- Set JWT_SECRET
- Deploy
```

### Variables d'environnement (Production)
```env
DATABASE_URL="postgresql://..." # Utiliser PostgreSQL en prod
JWT_SECRET="une-clé-très-longue-et-aléatoire"
NODE_ENV="production"
```

---

## 🧭 Navigation dans le code

### Pour débuter
1. **page.js** - Comprendre la structure
2. **components/Navbar.jsx** - Composants réutilisables
3. **app/login/page.jsx** - Formulaires
4. **app/api/auth/login/route.js** - API basics

### Pour avancer
1. **lib/auth.ts** - Authentification JWT
2. **prisma/schema.prisma** - Modèles de données
3. **middleware.ts** - Protection des routes
4. **app/admin/page.jsx** - State management

---

## 💡 Tips & Tricks

### Auto-générer slugs
```javascript
const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .replace(/\s+/g, "-");
```

### Parser JSON stocké en DB
```javascript
const images = JSON.parse(project.images);
const techs = JSON.parse(project.technologies);
```

### Ajouter animations Framer Motion
```javascript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

---

## 🐛 Troubleshooting

### "Database locked"
```bash
rm prisma/dev.db*
npx prisma migrate dev --name init
```

### "Module not found: 'jose'"
```bash
npm install jose
```

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001  # Use port 3001
```

---

## 📞 Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion

---

**Créé avec ❤️ pour les créatifs.**
