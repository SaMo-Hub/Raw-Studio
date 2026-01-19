#!/bin/bash

# 🎨 RAW STUDIO - Setup Verification Script
# Vérifie que le projet est correctement configuré

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           🎨 RAW STUDIO - Setup Verification                  ║"
echo "║        Portfolio Minimaliste Premium - Vérification             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Vérifications en cours...${NC}\n"

# 1. Check if package.json exists
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅${NC} package.json trouvé"
else
    echo -e "${RED}❌${NC} package.json manquant"
    exit 1
fi

# 2. Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} node_modules installé"
else
    echo -e "${YELLOW}⚠️${NC} node_modules manquant - exécutez 'npm install'"
fi

# 3. Check if .env exists
if [ -f ".env" ]; then
    echo -e "${GREEN}✅${NC} .env configuré"
else
    echo -e "${YELLOW}⚠️${NC} .env manquant - créez-le avec DATABASE_URL et JWT_SECRET"
fi

# 4. Check if prisma schema exists
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}✅${NC} Prisma schema trouvé"
else
    echo -e "${RED}❌${NC} prisma/schema.prisma manquant"
fi

# 5. Check if database exists
if [ -f "prisma/dev.db" ]; then
    echo -e "${GREEN}✅${NC} Base de données SQLite créée"
else
    echo -e "${YELLOW}⚠️${NC} prisma/dev.db manquant - exécutez 'npx prisma migrate dev --name init'"
fi

# 6. Check if src folder exists
if [ -d "src" ]; then
    echo -e "${GREEN}✅${NC} src/ folder trouvé"
else
    echo -e "${RED}❌${NC} src/ folder manquant"
fi

# 7. Check key files
echo ""
echo -e "${BLUE}📁 Fichiers clés:${NC}"

files=(
    "src/app/page.js"
    "src/app/login/page.jsx"
    "src/app/admin/page.jsx"
    "src/components/Navbar.jsx"
    "src/lib/auth.ts"
    "src/lib/db.ts"
    "src/middleware.ts"
    "src/app/api/auth/login/route.js"
    "src/app/api/projects/route.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${YELLOW}⚠️${NC} $file manquant"
    fi
done

echo ""
echo -e "${BLUE}📚 Documentation:${NC}"

docs=(
    "START_HERE.md"
    "DOCS.md"
    "GETTING_STARTED.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅${NC} $doc"
    else
        echo -e "${YELLOW}⚠️${NC} $doc manquant"
    fi
done

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo -e "${GREEN}✅ Vérification complète!${NC}"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${YELLOW}🚀 Prochaines étapes:${NC}"
echo ""
echo "1️⃣  Installez les dépendances (si pas déjà fait):"
echo -e "   ${BLUE}npm install${NC}"
echo ""
echo "2️⃣  Initialisez la base de données:"
echo -e "   ${BLUE}npx prisma migrate dev --name init${NC}"
echo ""
echo "3️⃣  Lancez le serveur de développement:"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo "4️⃣  Ouvrez dans votre navigateur:"
echo -e "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo -e "${GREEN}Bienvenue dans RAW STUDIO! 🎨${NC}"
echo ""
