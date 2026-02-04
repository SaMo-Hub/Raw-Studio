import prisma from "@/lib/db";

export async function GET() {
  try {
    // Afficher TOUS les projets pour les admins (actifs ET inactifs)
    const projects = await prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return Response.json(projects);
  } catch (error) {
    console.error("Get all projects error:", error);
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
