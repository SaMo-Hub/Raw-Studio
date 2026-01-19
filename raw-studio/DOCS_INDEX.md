# 📚 Documentation Index

## 🚀 Rapide Démarrage

### Pour les novices
👉 Commencez par: **START_HERE.md**
- Instructions d'installation
- Comment lancer le serveur
- Test basique

### Pour utiliser l'admin
👉 Consultez: **GETTING_STARTED.md**
- Comment se connecter
- Créer/éditer/supprimer des projets
- Upload d'images

### Pour tester tout
👉 Suivez: **TEST_GUIDE.md**
- Test complet du système
- Tous les cas d'usage
- Checklist de validation

---

## 📖 Documentation Technique

| Document | Focus | Pour qui |
|----------|-------|----------|
| **START_HERE.md** | Installation & démarrage | Devs |
| **GETTING_STARTED.md** | Usage du portfolio | Utilisateurs |
| **DOCS.md** | Documentation complète | Devs avancés |
| **PROJECT_PAGES.md** | Pages view/detail | Devs |
| **ROUTES_ARCHITECTURE.md** | Routes & flux | Devs |
| **PAGES_SUMMARY.md** | Résumé final | Tous |
| **TEST_GUIDE.md** | Tests complets | QA/Devs |
| **CHECKLIST.md** | Checklist de vérification | Tous |
| **SUMMARY.md** | Tech summary | Devs |
| **NAVIGATION.md** | Navigation docs | Tous |
| **README.md** | Readme générique | Tous |

---

## 🎯 Navigation par cas d'usage

### 🌐 Je veux juste consulter le portfolio
1. Lancer: `npm run dev`
2. Aller sur: http://localhost:3000
3. Voir: Galerie de projets
4. Cliquer: Sur un projet pour détail
5. Lire: **GETTING_STARTED.md** pour plus de contexte

### 🛠️ Je veux ajouter des projets
1. Lancer: `npm run dev`
2. Aller sur: http://localhost:3000/login
3. Mot de passe: `admin123`
4. Cliquer: "+ Create New Project"
5. Ajouter: Images, infos, technologies
6. Cliquer: "Create Project"
7. Lire: **GETTING_STARTED.md** pour les détails

### 👨‍💻 Je veux modifié le code
1. Lire: **DOCS.md** (documentation complète)
2. Explorer: `src/app/` (pages)
3. Modifier: `src/app/api/` (routes API)
4. Tester: Suivre **TEST_GUIDE.md**
5. Build: `npm run build`

### 🏗️ Je veux comprendre l'architecture
1. Lire: **ROUTES_ARCHITECTURE.md** (routes)
2. Lire: **SUMMARY.md** (tech stack)
3. Lire: **PAGES_SUMMARY.md** (pages)
4. Lire: **DOCS.md** (détails complets)

### 🧪 Je veux tester le système
1. Lire: **TEST_GUIDE.md** (guide complet)
2. Suivre: Les 9 étapes de test
3. Vérifier: Checklist de débogage
4. Valider: Tous les cas de test

### 📋 Je veux une checklist
1. Lire: **CHECKLIST.md** (vérification)
2. Cocher: Chaque point
3. Valider: Tout fonctionne

---

## 📂 Structure des fichiers

```
raw-studio/
├── src/
│   ├── app/
│   │   ├── page.js                    ← Accueil avec galerie
│   │   ├── login/
│   │   │   └── page.jsx               ← Login admin
│   │   ├── admin/
│   │   │   ├── page.jsx               ← Dashboard admin
│   │   │   └── projects/
│   │   │       ├── new/
│   │   │       │   └── page.jsx       ← Créer projet
│   │   │       └── [id]/
│   │   │           └── page.jsx       ← Éditer projet
│   │   ├── projects/
│   │   │   └── [slug]/
│   │   │       └── page.jsx           ← Détail projet
│   │   └── api/
│   │       ├── projects/              ← CRUD projets
│   │       ├── auth/                  ← Authentification
│   │       └── upload/                ← Upload images
│   ├── components/
│   │   └── Navbar.jsx                 ← Barre nav
│   └── middleware.ts                  ← Protection routes
├── prisma/
│   ├── schema.prisma                  ← Database schema
│   └── seed.js                        ← Données test
├── public/
│   └── uploads/                       ← Images uploadées
└── Documentation files...
```

---

## 🔗 Liens Directs

### Pages en cours d'exécution
- **Accueil**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Créer Projet**: http://localhost:3000/admin/projects/new
- **Détail Projet**: http://localhost:3000/projects/[slug]
- **Login**: http://localhost:3000/login

### Fichiers de code clés
- **Page accueil**: `src/app/page.js`
- **Page détail**: `src/app/projects/[slug]/page.jsx`
- **API projets**: `src/app/api/projects/route.js`
- **API upload**: `src/app/api/upload/route.js`
- **Database**: `prisma/schema.prisma`
- **Seed**: `prisma/seed.js`

---

## ✨ Fonctionnalités Principales

### Public (Visiteurs)
- ✅ Galerie de projets
- ✅ Détail projet avec images
- ✅ Navigation fluide
- ✅ Design responsive

### Admin (Authentifiés)
- ✅ Créer projets
- ✅ Éditer projets
- ✅ Supprimer projets
- ✅ Upload images
- ✅ Dashboard CRUD

### Système
- ✅ Authentification JWT
- ✅ Protection routes
- ✅ Base de données Prisma
- ✅ API RESTful
- ✅ Upload images sécurisé

---

## 🎓 Pour Apprendre

### Concepts utilisés
- **Next.js 16**: App Router, API routes
- **React 19**: Hooks, client components
- **Prisma**: ORM, migrations
- **SQLite**: Database (dev)
- **JWT**: Authentification
- **Tailwind**: Styling

### Ressources
- Docs Next.js: https://nextjs.org/docs
- Docs Prisma: https://www.prisma.io/docs
- Docs Tailwind: https://tailwindcss.com/docs
- Docs React: https://react.dev

---

## 🐛 Troubleshooting

### Problème: "Port 3000 already in use"
```bash
# Tuer le processus
lsof -i :3000
kill -9 <PID>

# Ou utiliser un autre port
PORT=3001 npm run dev
```

### Problème: "Database not found"
```bash
# Réinitialiser database
rm prisma/dev.db
npx prisma migrate dev
npx prisma db seed
```

### Problème: "JWT errors"
```bash
# Vider les cookies (DevTools > Application > Cookies)
# Supprimer tous les cookies de localhost:3000
# Recharger la page
```

### Problème: "Images ne s'affichent pas"
```bash
# Vérifier le dossier existe
mkdir -p public/uploads

# Checker les logs d'upload
# Vérifier dans DevTools > Network
```

---

## 📊 Quick Stats

- **Pages créées**: 3 (accueil, détail, édition)
- **API endpoints**: 8
- **Database models**: 2
- **Routes protégées**: 4
- **Fichiers docs**: 11
- **Total code**: ~2000 lignes
- **Temps de dev**: ~5 jours

---

## ✅ Validation Complète

Pour valider que tout fonctionne:

```bash
# 1. Installation
npm install

# 2. Database
npx prisma migrate dev
npx prisma db seed

# 3. Serveur
npm run dev

# 4. Tests
# Suivez TEST_GUIDE.md

# 5. Build
npm run build

# 6. Production
npm start
```

---

## 🎯 Points d'entrée

**Si tu es perdu, commence par:**
1. Lis **START_HERE.md** (5 min)
2. Utilise **TEST_GUIDE.md** (20 min)
3. Lis **PAGES_SUMMARY.md** (10 min)
4. Explore le code dans `src/`

**Vous avez maintenant un portfolio complet et fonctionnel!** 🚀

Questions? Consulte:
- **DOCS.md** pour les détails techniques
- **ROUTES_ARCHITECTURE.md** pour les routes
- **GETTING_STARTED.md** pour les instructions
