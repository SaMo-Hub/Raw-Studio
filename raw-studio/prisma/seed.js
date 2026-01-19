const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Nettoyer les données existantes
  await prisma.project.deleteMany();
  await prisma.accessKey.deleteMany();

  // Créer une clé d'accès admin avec le mot de passe "admin123"
  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
  
  const adminKey = await prisma.accessKey.create({
    data: {
      value: hashedPasswordAdmin,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Admin key created (password: admin123)");

  // Créer une clé d'accès service avec le mot de passe "service123"
  const hashedPasswordService = await bcrypt.hash("service123", 10);
  
  const serviceKey = await prisma.accessKey.create({
    data: {
      value: hashedPasswordService,
      role: "SERVICE",
      isActive: true,
    },
  });

  console.log("✅ Service key created (password: service123)");

  // Créer des projets d'exemple
  const project1 = await prisma.project.create({
    data: {
      title: "Vanta - Interactive Background Generator",
      slug: "vanta-interactive",
      shortDesc: "Animated 3D background generator with WebGL integration",
      longDesc: `A stunning interactive 3D background generator built with Three.js and WebGL.
      
This project showcases advanced web technologies to create immersive, animated backgrounds that enhance modern web design. Perfect for creative portfolios and premium websites.

**Features:**
- Real-time 3D rendering
- Multiple animation styles
- Responsive design
- Performance optimized`,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=600&fit=crop",
      ]),
      technologies: JSON.stringify(["Three.js", "WebGL", "React", "Next.js", "TypeScript"]),
      externalLink: "https://vanta.tv",
      featured: true,
      displayOrder: 1,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "Don Prod - Creative Studio Portfolio",
      slug: "don-prod-portfolio",
      shortDesc: "Minimal and bold portfolio showcasing creative work",
      longDesc: `A beautifully designed portfolio website for a creative studio.
      
This project demonstrates the power of minimalist design combined with bold typography and generous whitespace. Every element serves a purpose, creating a premium user experience.

**Highlights:**
- Minimal aesthetic
- Bold typography
- Smooth animations
- Image-focused layout
- Mobile responsive`,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1543269865-cbdf26effbad?w=1200&h=600&fit=crop",
      ]),
      technologies: JSON.stringify(["Next.js", "Tailwind CSS", "Framer Motion", "React"]),
      featured: true,
      displayOrder: 2,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: "Mario Roudil - Designer Portfolio",
      slug: "mario-roudil-design",
      shortDesc: "Contemporary design portfolio with experimental layouts",
      longDesc: `An innovative portfolio showcasing design and creative direction work.
      
Featuring experimental layouts, bold typography choices, and a focus on visual storytelling. This project pushes the boundaries of conventional portfolio design.

**Characteristics:**
- Experimental grid layouts
- Bold visual hierarchy
- Contemporary aesthetic
- Engaging animations
- Narrative-driven content`,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
      ]),
      technologies: JSON.stringify(["Web Design", "Typography", "Motion Design", "Creative Direction"]),
      featured: true,
      displayOrder: 3,
    },
  });

  console.log("✅ Projects created");
  console.log("\n📊 Database seeded successfully!");
  console.log("Admin password: admin123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
