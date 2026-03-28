import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return Response.json({ error: "Project ID is required" }, { status: 400 });
    }

    const { data: project, error } = await supabaseAdmin
      .from("Project")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json(project, {
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Get project error:", error);
    return Response.json({ error: "Failed to fetch project", details: error.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { title, slug, shortDesc, longDesc, client, images, category, externalLink, featured, displayOrder, isActive } =
      await request.json();

    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(shortDesc && { shortDesc }),
      ...(longDesc && { longDesc }),
      ...(client && { client }),
      ...(images && { images: typeof images === "string" ? images : JSON.stringify(images) }),
      ...(category && { category }),
      ...(externalLink !== undefined && { externalLink }),
      ...(featured !== undefined && { featured }),
      ...(displayOrder !== undefined && { displayOrder }),
      ...(isActive !== undefined && { isActive }),
    };

    const { data: project, error } = await supabaseAdmin
      .from("Project")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return Response.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    return Response.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    // Récupérer le projet pour avoir les images
    const { data: project } = await supabaseAdmin
      .from("Project")
      .select("images")
      .eq("id", id)
      .single();

    // Supprimer les images du bucket
    if (project?.images) {
      const images = typeof project.images === "string"
        ? JSON.parse(project.images)
        : project.images;

      const filePaths = images
        .map((url) => {
          try {
            const path = new URL(url).pathname;
            // Extraire le nom du fichier après "/object/public/raw-studio-media/"
            const match = path.match(/\/object\/public\/raw-studio-media\/(.+)/);
            return match ? decodeURIComponent(match[1]) : null;
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      if (filePaths.length > 0) {
        await supabaseAdmin.storage.from("raw-studio-media").remove(filePaths);
      }
    }

    const { error } = await supabaseAdmin
      .from("Project")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return Response.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
