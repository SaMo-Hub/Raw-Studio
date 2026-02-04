import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Exporter tous les projets
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Formater pour l'export
    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      projects: projects.map((p) => ({
        ...p,
        // S'assurer que les JSON sont des strings
        images:
          typeof p.images === "string" ? p.images : JSON.stringify(p.images),
        technologies:
          typeof p.technologies === "string"
            ? p.technologies
            : JSON.stringify(p.technologies),
        videos: p.videos
          ? typeof p.videos === "string"
            ? p.videos
            : JSON.stringify(p.videos)
          : null,
      })),
    };

    return NextResponse.json(exportData, { status: 200 });
  } catch (error) {
    console.error("Error exporting projects:", error);
    return NextResponse.json(
      { error: "Failed to export projects" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { projects } = await request.json();

    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { error: "Projects must be an array" },
        { status: 400 }
      );
    }

    // Supprimer les projets existants
    await prisma.project.deleteMany();

    // Importer les nouveaux projets
    const imported = await Promise.all(
      projects.map((project) =>
        prisma.project.create({
          data: {
            id: project.id,
            title: project.title,
            slug: project.slug,
            shortDesc: project.shortDesc,
            longDesc: project.longDesc,
            images: project.images,
            technologies: project.technologies,
            videos: project.videos,
            externalLink: project.externalLink,
            featured: project.featured,
            displayOrder: project.displayOrder,
          },
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        message: `Imported ${imported.length} projects`,
        count: imported.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error importing projects:", error);
    return NextResponse.json(
      { error: "Failed to import projects" },
      { status: 500 }
    );
  }
}
