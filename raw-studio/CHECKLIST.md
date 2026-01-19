# ✅ RAW STUDIO - Checklist de vérification

Utilisez cette checklist pour vérifier que tout fonctionne correctement.

---

## 🚀 Installation & Setup

- [ ] Dossier `raw-studio/` existe
- [ ] `npm install` exécuté avec succès
- [ ] `.env` fichier existe avec:
  - [ ] `DATABASE_URL="file:./prisma/dev.db"`
  - [ ] `JWT_SECRET="votre-secret"`
  - [ ] `NODE_ENV="development"`
- [ ] `npx prisma migrate dev --name init` exécuté
- [ ] `prisma/dev.db` créé
- [ ] Données de test chargées (admin + 3 projets)

---

## 🌐 Frontend - Accueil

- [ ] `npm run dev` lance sans erreurs
- [ ] http://localhost:3000 s'ouvre
- [ ] Navbar visible avec logo "RAW STUDIO"
- [ ] Menu: Portfolio, About, Login/Admin
- [ ] Hero section avec titre et description
- [ ] Galerie de projets affichée (3 projets)
- [ ] Footer visible
- [ ] Responsive sur mobile (test via DevTools)

---

## 🔑 Login Page

- [ ] http://localhost:3000/login accessible
- [ ] Titre "Admin Access" visible
- [ ] Formulaire avec champ password
- [ ] Info de démo affichée (password: admin123)
- [ ] Bouton "Sign In" fonctionnel
- [ ] Erreur affichée avec password invalide
- [ ] Redirection vers /admin avec bon password

---

## 🔐 Admin Dashboard

- [ ] http://localhost:3000/admin accessible (après login)
- [ ] Titre "Dashboard"
- [ ] Liste des 3 projets de test affichée
- [ ] Bouton "+ New Project"
- [ ] Actions "View", "Edit", "Delete" visibles
- [ ] Navbar montre "Logout" au lieu de "Login"

---

## ➕ Créer un projet

- [ ] Bouton "+ New Project" fonctionne
- [ ] Formulaire complet visible avec:
  - [ ] Title
  - [ ] Slug (URL-friendly)
  - [ ] Short Description
  - [ ] Long Description
  - [ ] Images (textarea)
  - [ ] Technologies
  - [ ] External Link
  - [ ] Featured checkbox
  - [ ] Bouton "Create Project"
- [ ] Projet créé avec succès
- [ ] Redirection vers /admin
- [ ] Nouveau projet visible dans la liste

---

## 📄 Page projet

- [ ] Cliquer sur projet → URL: `/projects/[slug]`
- [ ] Titre du projet affiché
- [ ] Description courte & longue visible
- [ ] Images affichées
- [ ] Technologies listées
- [ ] Lien externe (si défini) accessible

---

## 🗑️ Édition & Suppression

- [ ] Cliquer "Edit" → Formulaire pré-rempli
- [ ] Modifications sauvegardées correctement
- [ ] Cliquer "Delete" → Confirmation dialog
- [ ] Projet supprimé après confirmation
- [ ] Projet disparu de la galerie

---

## 🔌 API Routes

- [ ] `GET /api/projects` retourne JSON array
- [ ] `GET /api/projects/[id]` retourne un projet
- [ ] `POST /api/projects` crée un nouveau projet
- [ ] `PUT /api/projects/[id]` modifie un projet
- [ ] `DELETE /api/projects/[id]` supprime un projet

Testez avec curl:
```bash
curl http://localhost:3000/api/projects
```

---

## 🔐 Authentification

- [ ] Cookie `auth_token` défini après login (DevTools → Application)
- [ ] Cookie est HTTP-only (pas accessible en JavaScript)
- [ ] Logout supprime le cookie
- [ ] Routes /admin requièrent authentification
- [ ] Redirection automatique vers /login si pas authentifié

---

## 🎨 Design & UX

- [ ] Couleurs cohérentes (blanc, noir, gris)
- [ ] Typographie Inter utilisée
- [ ] Espaces généreux (whitespace)
- [ ] Pas d'éléments décoratifs inutiles
- [ ] Navigation fluide entre pages
- [ ] Transitions douces
- [ ] Mobile-responsive (test sur écran < 768px)
- [ ] Écran > 1200px bien spaced

---

## 📊 Base de données

- [ ] Prisma Studio accessible:
  ```bash
  npx prisma studio
  ```
- [ ] Tables `Project` et `AccessKey` présentes
- [ ] Données de test présentes:
  - [ ] Admin key avec password hashed
  - [ ] 3 projets d'exemple
- [ ] IDs générés (CUID format)
- [ ] Timestamps (createdAt, updatedAt) présents

---

## 🛠️ Code & Configuration

- [ ] `src/` structure correcte
- [ ] `prisma/schema.prisma` bien défini
- [ ] `.env` configuré
- [ ] `next.config.mjs` présent
- [ ] `tailwind.config.ts` présent
- [ ] `tsconfig.json` ou `jsconfig.json` présent
- [ ] Pas d'erreurs TypeScript (si utilisé)

---

## 📚 Documentation

- [ ] **START_HERE.md** accessible et clair
- [ ] **DOCS.md** complet
- [ ] **GETTING_STARTED.md** utile
- [ ] Commentaires dans le code clés
- [ ] API routes documentées

---

## 🚀 Performance

- [ ] Page charge < 2s
- [ ] Images se chargent correctement
- [ ] Pas de lag lors des interactions
- [ ] Animations fluides (60fps)
- [ ] No console errors

Testez:
```bash
npm run build
npm start
# Check production performance
```

---

## 🐛 Edge Cases

- [ ] Soumission formulaire vide → erreur
- [ ] Upload image URL invalide → gestion
- [ ] Double-clic "Create" → pas de duplication
- [ ] Navigation browser back/forward → fonctionne
- [ ] Page refresh en admin → reste en admin (pas déconnecté)
- [ ] Fermer onglet → session perd le cookie

---

## 🚢 Déploiement (Optionnel)

- [ ] `npm run build` exécuté sans erreurs
- [ ] `npm start` lance la build production
- [ ] Tout fonctionne en mode production
- [ ] Variables d'env correctement définies
- [ ] Database URL pointée vers la bonne base

---

## ✅ Finalisation

- [ ] Tous les tests ci-dessus passent
- [ ] Code commité vers Git
- [ ] README.md à jour
- [ ] Pas de fichiers sensibles commités (.env, node_modules)
- [ ] `.gitignore` correct
- [ ] Prêt pour production

---

## 📝 Notes personnelles

Ajoutez vos notes ici:

```
□ Point 1:
□ Point 2:
□ Point 3:
```

---

**Signez ici quand tout est OK:** _______________

**Date:** _______________

---

**Bravo! 🎉 Votre portfolio est prêt!**
