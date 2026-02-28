import prisma from "@/lib/db";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true }, // Afficher seulement les projets actifs
      orderBy: { displayOrder: "asc" },
    });
    return Response.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, slug, shortDesc, longDesc, client, images, technologies, externalLink, featured, isActive } =
      await request.json();

    if (!title || !slug) {
      return Response.json({ error: "Title and slug required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        shortDesc,
        longDesc,
        client,
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        technologies: JSON.stringify(typeof technologies === "string" ? [technologies] : technologies || []),
        externalLink,
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return Response.json({ error: "Failed to create project" }, { status: 500 });
  }
}
