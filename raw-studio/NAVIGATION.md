# 📑 RAW STUDIO - Navigation Documentation

**Bienvenue dans RAW STUDIO!** 🎨

Utilisez ce fichier pour naviguer dans la documentation et le projet.

---

## 🗂️ Structure de la documentation

### Pour commencer (5-10 minutes)
1. **📖 [START_HERE.md](./START_HERE.md)** ← **COMMENCEZ ICI!**
   - Vue d'ensemble
   - Démarrage rapide (3 étapes)
   - Structure du projet
   - Commandes essentielles

### Pour approfondir (20-30 minutes)
2. **📚 [DOCS.md](./DOCS.md)**
   - Documentation complète
   - Tous les modèles de données
   - Routes API détaillées
   - Sécurité & best practices
   - Customization

3. **📖 [GETTING_STARTED.md](./GETTING_STARTED.md)**
   - Guide détaillé de démarrage
   - Architecture expliquée
   - Étapes pas à pas
   - FAQ & troubleshooting

### Pour vérifier (10-15 minutes)
4. **✅ [CHECKLIST.md](./CHECKLIST.md)**
   - Checklist complète de vérification
   - Tous les tests à faire
   - Validation du setup
   - Points à cocher

### Vue d'ensemble complète (5 minutes)
5. **📋 [SUMMARY.md](./SUMMARY.md)** ← Résumé technique complet
   - Toutes les technologies
   - Tous les fichiers
   - Tous les concepts
   - Flux utilisateur

---

## 🎯 Par usecase

### "Je viens d'installer et je veux lancer le site"
1. Lire: [START_HERE.md](./START_HERE.md)
2. Exécuter les 3 commandes
3. Visiter http://localhost:3000
4. ✅ Done!

### "Je veux ajouter un projet"
1. Lire: [START_HERE.md#-ajouter-un-projet](./START_HERE.md) (section "Ajouter un projet")
2. Connexion: http://localhost:3000/login (admin123)
3. Cliquer "+ New Project"
4. Remplir le formulaire
5. Cliquer "Create"

### "Je veux comprendre l'architecture"
1. Lire: [DOCS.md#-architecture--fonctionnalités](./DOCS.md)
2. Lire: [SUMMARY.md#-architecture-decisions](./SUMMARY.md)
3. Explorer: `prisma/schema.prisma`
4. Explorer: `src/app/api/`

### "Quelque chose ne fonctionne pas"
1. Lire: [CHECKLIST.md](./CHECKLIST.md) - vérifier chaque point
2. Lire: [DOCS.md#-troubleshooting](./DOCS.md) - solutions communes
3. Lire: [GETTING_STARTED.md#-troubleshooting](./GETTING_STARTED.md)

### "Je veux déployer en production"
1. Lire: [DOCS.md#-déploiement](./DOCS.md)
2. Lire: [START_HERE.md#-déploiement-production](./START_HERE.md)
3. Suivre les étapes Vercel

### "Je veux personnaliser le design"
1. Lire: [DOCS.md#-customization](./DOCS.md)
2. Modifier `src/app/globals.css`
3. Modifier `src/components/Navbar.jsx`
4. Relancer `npm run dev`

### "Je veux ajouter une nouvelle page"
1. Créer `src/app/ma-page/page.jsx`
2. Importer `Navbar`
3. Ajouter contenu
4. Ajouter lien dans `Navbar.jsx`

### "Je veux comprendre l'API"
1. Lire: [DOCS.md#-api-routes](./DOCS.md)
2. Lire: [SUMMARY.md#-api-routes](./SUMMARY.md)
3. Tester avec curl:
   ```bash
   curl http://localhost:3000/api/projects
   ```

---

## 📂 Fichiers clés du projet

### Frontend
| Fichier | Objectif | Exemple |
|---------|----------|---------|
| `src/app/page.js` | Accueil + Galerie | Voir les projets |
| `src/app/login/page.jsx` | Page login | Se connecter |
| `src/app/admin/page.jsx` | Dashboard admin | Gérer les projets |
| `src/components/Navbar.jsx` | Navigation | Menu principal |
| `src/app/globals.css` | Styles globaux | Personnaliser couleurs |

### Backend
| Fichier | Objectif | URL |
|---------|----------|-----|
| `src/app/api/auth/login/route.js` | Connexion | POST /api/auth/login |
| `src/app/api/projects/route.js` | Projets (list/create) | GET/POST /api/projects |
| `src/app/api/projects/[id]/route.js` | Projet (detail/edit/delete) | GET/PUT/DELETE /api/projects/[id] |

### Database
| Fichier | Objectif |
|---------|----------|
| `prisma/schema.prisma` | Modèles de données |
| `prisma/seed.js` | Données de test |
| `src/lib/db.ts` | Prisma client singleton |

### Configuration
| Fichier | Objectif |
|---------|----------|
| `.env` | Variables d'environnement |
| `package.json` | Dépendances et scripts |
| `tsconfig.json` | Configuration TypeScript |
| `tailwind.config.ts` | Configuration Tailwind |

---

## 🚀 Commandes principales

| Commande | Objectif |
|----------|----------|
| `npm install` | Installer dépendances |
| `npm run dev` | Lancer serveur dev |
| `npm run build` | Build production |
| `npm start` | Run production |
| `npx prisma migrate dev --name init` | Créer DB + migrations |
| `npx prisma db seed` | Charger données test |
| `npx prisma studio` | GUI pour la DB |

---

## 📊 Flux de navigation

```
http://localhost:3000
│
├─ / (Accueil)
│  ├─ Navbar avec logo RAW STUDIO
│  ├─ Hero section
│  ├─ Galerie de projets (3 de test)
│  └─ Footer
│
├─ /login (Public)
│  ├─ Formulaire password
│  └─ Infos de démo
│
├─ /projects/[slug] (Public)
│  ├─ Détails du projet
│  ├─ Images
│  ├─ Technologies
│  └─ Lien externe
│
├─ /admin (Protégé)
│  ├─ Dashboard
│  └─ Liste projets avec actions
│
└─ /admin/projects/new (Protégé)
   └─ Formulaire création
```

---

## 🔑 Credentials de test

```
URL: http://localhost:3000/login
Username: (pas utilisé)
Password: admin123
Role: ADMIN
```

---

## 📚 Ressources externes

### Documentations
- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion

### Outils utiles
- **Vercel:** https://vercel.com (hosting)
- **GitHub:** https://github.com (versioning)
- **PostgreSQL:** https://postgresql.org (production DB)

---

## 🎓 Concepts clés expliqués

### 1. Next.js App Router
- Dossiers = routes
- `page.js` = contenu
- `layout.js` = wrapper
- `route.js` = API

### 2. Authentification JWT
1. User envoie password
2. Server valide vs hash
3. Server crée JWT
4. Client stocke en cookie
5. Client envoie à chaque requête

### 3. Prisma ORM
- Modèles dans `schema.prisma`
- Auto-migration
- Type-safe queries
- Query builder intuitif

### 4. Middleware Next.js
- Intercepte les requêtes
- Valide JWT tokens
- Redirige si pas auth

---

## ✅ Quick reference

### Setup (une seule fois)
```bash
cd raw-studio
npm install
npx prisma migrate dev --name init
npm run dev
```

### Utilisation quotidienne
```bash
npm run dev              # Démarrer
http://localhost:3000   # Visiter
```

### Troubleshooting rapide
```bash
npm install                    # Réinstaller deps
rm prisma/dev.db && npm run dev # Reset DB
npm run build                  # Checker build
```

---

## 🎉 Prochains pas

### Minute 0-5: Démarrage
→ Lisez [START_HERE.md](./START_HERE.md)
→ Lancez `npm run dev`
→ Visitez http://localhost:3000

### Minute 5-15: Exploration
→ Cliquez sur les projets
→ Testez la galerie
→ Explorez le code

### Minute 15-30: Customisation
→ Connectez-vous (admin123)
→ Créez un nouveau projet
→ Observez en temps réel

### Minute 30+: Approfondissement
→ Lisez [DOCS.md](./DOCS.md)
→ Étudiez l'architecture
→ Ajoutez vos projets réels

---

## 🆘 Besoin d'aide?

| Question | Où chercher |
|----------|-----------|
| "Comment démarrer?" | [START_HERE.md](./START_HERE.md) |
| "Où est X?" | Ce fichier (Navigation) |
| "Comment marche Y?" | [DOCS.md](./DOCS.md) |
| "Ça ne fonctionne pas" | [CHECKLIST.md](./CHECKLIST.md) + [DOCS.md](./DOCS.md) |
| "Comment personnaliser?" | [DOCS.md#customization](./DOCS.md) |
| "Pourquoi telle technologie?" | [SUMMARY.md](./SUMMARY.md) |

---

## 📞 Support technique

1. **Avant tout:** Consultez la documentation
2. **Si ça bug:** Vérifiez la [CHECKLIST.md](./CHECKLIST.md)
3. **Si ça persiste:** Regardez le troubleshooting dans [DOCS.md](./DOCS.md)
4. **Si tout échoue:** Reset complet:
   ```bash
   rm -rf node_modules prisma/dev.db
   npm install
   npx prisma migrate dev --name init
   npm run dev
   ```

---

## 🎁 Bonus

### Voir la base de données graphiquement
```bash
npx prisma studio
# Ouvre http://localhost:5555
```

### Build et tester la production
```bash
npm run build
npm start
# Teste à http://localhost:3000
```

### Vérifier que tout va bien
```bash
bash verify-setup.sh
# Ou utiliser la CHECKLIST.md
```

---

**Bienvenue dans RAW STUDIO!** 🚀

Pour démarrer maintenant, allez à [START_HERE.md](./START_HERE.md)

---

*Créé le 19 janvier 2026 | Version 1.0.0 | Portfolio Minimaliste Premium*
