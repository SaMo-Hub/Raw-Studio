# 🧪 Guide de Test Complet

## 🚀 Démarrage

```bash
# Terminal 1: Serveur
cd raw-studio
npm run dev

# Terminal 2: (Optionnel) Monitoring
npm run build
```

Accédez à: http://localhost:3000

---

## ✅ Test 1: Consulter la galerie publique

### Étapes:
1. Allez sur http://localhost:3000
2. Vous devriez voir:
   - Hero section avec titre
   - Galerie de 3 projets (si seedés)

### Résultats attendus:
- ✅ Les projets s'affichent en grid
- ✅ Les images se chargent
- ✅ Texte visible (titre, description)
- ✅ Tags technologie visibles

---

## ✅ Test 2: Voir le détail d'un projet

### Étapes:
1. Depuis la galerie, cliquez sur une carte projet
2. Vous arrivez sur `/projects/[slug]`

### Résultats attendus:
- ✅ Titre du projet grand et visible
- ✅ Image principale affichée
- ✅ Miniatures en bas (si plusieurs images)
- ✅ Description complète (longDesc)
- ✅ Liste des technologies
- ✅ Lien externe (si configuré)
- ✅ Sidebar avec infos (année, type, etc.)
- ✅ Bouton "← Back to Portfolio" fonctionne

### Test galerie d'images:
- Cliquez sur les miniatures → image principale change
- Vérifiez les images se chargent bien

---

## ✅ Test 3: Authentification admin

### Étapes:
1. Allez sur http://localhost:3000/login
2. Entrez le mot de passe: **admin123**
3. Cliquez "Login"

### Résultats attendus:
- ✅ Redirection vers `/admin`
- ✅ Navbar affiche maintenant "Admin" et "Logout"
- ✅ Pas de message d'erreur

---

## ✅ Test 4: Dashboard admin

### Étapes:
1. Une fois loggé, vous êtes sur `/admin`
2. Vous devriez voir:
   - Titre "Admin Dashboard"
   - Liste des projets avec boutons

### Résultats attendus:
- ✅ 3 projets seedés s'affichent
- ✅ Chaque projet a 3 boutons:
  - "Edit" → mène à `/admin/projects/[id]`
  - "Delete" → supprime le projet
  - "View" → va à `/projects/[slug]`
- ✅ Bouton "+ Create New Project" en haut

---

## ✅ Test 5: Créer un nouveau projet

### Étapes:
1. Cliquez sur "+ Create New Project"
2. Remplissez le formulaire:
   - Title: "My Cool Project"
   - Slug: "my-cool-project"
   - Short Description: "A test project"
   - Long Description: "This is a detailed description..."
   - Technologies: "React, Next.js, Tailwind"
   - External Link: https://example.com (optionnel)
   - Featured: Cochez si vous voulez

### Test d'upload d'images:
1. Dans la section "Upload Images":
   - Cliquez sur la zone en pointillés
   - Sélectionnez 1-3 images de votre PC
   - Les images devraient:
     - Se charger (vous verrez "Uploading...")
     - S'afficher en miniatures
     - Avoir un bouton "Remove" au hover

### Sauvegarde:
1. Cliquez "Create Project"
2. Vous êtes redirigé vers `/admin`
3. Le nouveau projet apparaît en bas de liste

### Vérification:
1. Allez sur la galerie publique (`/`)
2. Votre nouveau projet devrait apparaître
3. Cliquez dessus pour vérifier les images et le contenu

---

## ✅ Test 6: Éditer un projet

### Étapes:
1. Depuis `/admin`, cliquez "Edit" sur un projet
2. Vous arrivez sur `/admin/projects/[id]`
3. Le formulaire est pré-rempli avec les données

### Modifications:
- Changez le titre
- Uploadez une nouvelle image
- Modifiez la description
- Supprimez une image existante (bouton "Remove")

### Sauvegarde:
1. Cliquez "Save Project"
2. Vérifiez que la modification s'affiche:
   - Dans `/admin`
   - Dans `/projects/[slug]`
   - Dans `/`

---

## ✅ Test 7: Supprimer un projet

### Étapes:
1. Depuis `/admin`, cliquez "Delete" sur un projet
2. Confirmez la suppression (si popup)
3. Le projet disparaît de la liste

### Vérification:
- Le projet n'apparaît plus sur:
  - `/admin`
  - `/`
- Si vous essayez d'accéder directement au `/projects/[slug]` → erreur 404

---

## ✅ Test 8: Déconnexion

### Étapes:
1. Cliquez "Logout" dans la navbar
2. Vous êtes redirigé vers `/`
3. Navbar affiche "Login" au lieu de "Admin"

### Vérification:
- Essayez d'accéder à `/admin` → redirection vers `/login`

---

## ✅ Test 9: Responsive design

### Étapes:
1. Testez sur différentes tailles:
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)

### Outils:
- DevTools (F12)
- Utilisez le device emulator

### Vérifications:
- ✅ Galerie: 1 col mobile → 2 cols tablet → 3 cols desktop
- ✅ Images responsive
- ✅ Texte lisible sur tous les appareils
- ✅ Boutons cliquables sur mobile

---

## 🔍 Checklist de débogage

Si quelque chose ne fonctionne pas:

```
□ Vérifiez que npm run dev tourne
□ Pas d'erreurs dans la console (DevTools)
□ Base de données seedée (3 projets)
□ Les images se chargent depuis /public/uploads/
□ JWT token dans les cookies (DevTools > Application > Cookies)
□ Middleware route protection fonctionne
```

### Commandes de debug:

```bash
# Réinstaller les dépendances
npm install

# Reset la base de données
rm prisma/dev.db
npx prisma migrate dev

# Reseed les données
npx prisma db seed

# Build de test
npm run build
npm start
```

---

## 📊 Cas de test résumé

| Test | Route | Résultat | Status |
|------|-------|---------|--------|
| Galerie | GET / | 3 projets affichés | ✅ |
| Détail | GET /projects/[slug] | Page complète | ✅ |
| Login | POST /api/auth/login | JWT créé | ✅ |
| Admin | GET /admin | Dashboard | ✅ |
| Créer | POST /api/projects + upload | Nouveau projet | ✅ |
| Éditer | PUT /api/projects/[id] | Modifications sauvées | ✅ |
| Supprimer | DELETE /api/projects/[id] | Projet disparu | ✅ |
| Logout | POST /api/auth/logout | Cookie supprimé | ✅ |

---

## 🎯 Validation finale

Une fois tous les tests passés:

✅ Portfolio fonctionnel avec:
- Galerie publique
- Pages détail interactives
- CRUD complet en admin
- Upload d'images
- Authentification sécurisée
- Design minimaliste responsive

Prêt pour le déploiement! 🚀
