import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from("Project")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      projects: projects.map((p) => ({
        ...p,
        images: typeof p.images === "string" ? p.images : JSON.stringify(p.images),
        technologies: typeof p.technologies === "string" ? p.technologies : JSON.stringify(p.technologies),
        videos: p.videos ? (typeof p.videos === "string" ? p.videos : JSON.stringify(p.videos)) : null,
      })),
    };

    return NextResponse.json(exportData, { status: 200 });
  } catch (error) {
    console.error("Error exporting projects:", error);
    return NextResponse.json({ error: "Failed to export projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { projects } = await request.json();

    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: "Projects must be an array" }, { status: 400 });
    }

    // Supprimer tous les projets existants
    const { error: deleteError } = await supabaseAdmin
      .from("Project")
      .delete()
      .not("id", "is", null);

    if (deleteError) throw deleteError;

    // Importer les nouveaux projets
    const { data: imported, error: insertError } = await supabaseAdmin
      .from("Project")
      .insert(
        projects.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          shortDesc: p.shortDesc,
          longDesc: p.longDesc,
          images: p.images,
          technologies: p.technologies,
          videos: p.videos,
          externalLink: p.externalLink,
          featured: p.featured,
          displayOrder: p.displayOrder,
        }))
      )
      .select();

    if (insertError) throw insertError;

    return NextResponse.json(
      { success: true, message: `Imported ${imported.length} projects`, count: imported.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error importing projects:", error);
    return NextResponse.json({ error: "Failed to import projects" }, { status: 500 });
  }
}
