# 🎯 Architecture Routes Complète

## 📍 Routes Publiques (Accessibles à tous)

```
/                          → Accueil avec galerie dynamique
├── Affiche tous les projets
├── Chargement depuis /api/projects
└── Chaque projet → lien vers /projects/[slug]

/projects/[slug]           → Détail d'un projet
├── Galerie d'images interactive
├── Description complète
├── Technologies
├── Lien externe
└── "Back to Portfolio" → revient à /
```

## 🔐 Routes Protégées (Authentification requise)

```
/admin                     → Dashboard admin
├── Liste des projets
├── Boutons Edit / Delete
└── Bouton "Create New Project"

/admin/projects/new        → Créer un projet
├── Formulaire complet
├── Upload d'images depuis PC
├── Prévisualisation des images
└── Sauvegarde dans la BD

/admin/projects/[id]       → Éditer un projet
├── Chargement du projet existant
├── Modification de tous les champs
├── Upload d'images supplémentaires
└── Suppression d'images
```

## 🔌 API Routes (Backend)

```
GET  /api/projects              → Liste tous les projets
POST /api/projects              → Créer un projet
GET  /api/projects/[id]         → Détail d'un projet
PUT  /api/projects/[id]         → Éditer un projet
DELETE /api/projects/[id]       → Supprimer un projet

POST /api/upload                → Upload une image
POST /api/auth/login            → Authentification
POST /api/auth/logout           → Déconnexion
```

## 🔄 Flux utilisateur

### Visiteur (Public)
```
Accueil (/)
  ↓
Voir galerie de projets
  ↓
Cliquer sur un projet
  ↓
Détail du projet
  ↓
Voir images, description, lien
  ↓
Retour à l'accueil
```

### Admin
```
/login
  ↓
Entrer password admin (admin123)
  ↓
/admin (Dashboard)
  ↓
Menu:
  - Créer → /admin/projects/new
  - Éditer → /admin/projects/[id]
  - Supprimer → Confirmation + API
  - Logout → /
```

## 📊 Stockage des données

### Base de données (Prisma/SQLite)
```
Project
├── id: string (Prisma ID)
├── title: string
├── slug: string (unique)
├── shortDesc: string
├── longDesc: string
├── images: string[] (JSON)
├── technologies: string[] (JSON)
├── externalLink: string (optional)
├── featured: boolean
├── displayOrder: number
├── createdAt: timestamp
├── updatedAt: timestamp
└── deletedAt: timestamp (soft delete)
```

### Système de fichiers
```
/public/uploads/
├── 1704xxxx-xxx-image1.jpg
├── 1704xxxx-xxx-image2.jpg
└── ...
```

## 🔐 Sécurité

```
Authentification:
  ├── Token JWT (jose library)
  ├── HTTP-only cookies
  ├── 7 jours d'expiration
  └── bcryptjs pour mot de passe

Middleware (/middleware.ts):
  ├── Protège /admin/*
  ├── Valide le JWT
  ├── Redirige si non authentifié
  └── Permet accès public sinon
```

## 🎨 Pages créées/modifiées

| Fichier | Type | Status | Description |
|---------|------|--------|-------------|
| `/page.js` | Public | ✅ Mise à jour | Galerie dynamique |
| `/projects/[slug]/page.jsx` | Public | ✅ Créé | Détail projet |
| `/admin/page.jsx` | Protégé | ✅ Existant | Dashboard |
| `/admin/projects/new/page.jsx` | Protégé | ✅ Mise à jour | Créer avec upload |
| `/admin/projects/[id]/page.jsx` | Protégé | ✅ Créé | Éditer avec upload |
| `/login/page.jsx` | Public | ✅ Existant | Authentification |

## 🚀 Déploiement

### Fichiers clés pour production
- Base de données: Migrer vers PostgreSQL
- Images: Configurer CDN ou stockage cloud (AWS S3, etc.)
- Variables env: Configurer en production

### Build
```bash
npm run build
npm run start
```

## 📈 Statistiques

- **Total routes**: 15+ (4 publiques, 4 protégées, 7+ API)
- **Components**: 5 (Navbar, + pages)
- **API endpoints**: 8
- **Database models**: 2 (Project, AccessKey)
- **Middleware protections**: 1 (admin)
- **Features**: Galerie, CRUD, Upload, Auth
