import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from("Project")
      .select("*")
      .eq("isActive", true)
      .order("displayOrder", { ascending: true });

    if (error) throw error;
    return Response.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, slug, shortDesc, longDesc, client, images, category, externalLink, featured, isActive } =
      await request.json();

    if (!title) {
      return Response.json({ error: "Title required" }, { status: 400 });
    }

    const autoSlug = (slug || title)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const now = new Date().toISOString();
    const { data: project, error } = await supabaseAdmin
      .from("Project")
      .insert({
        title,
        slug: autoSlug,
        shortDesc,
        longDesc,
        client,
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        category,
        externalLink,
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: now,
      })
      .select()
      .single();

    if (error) throw error;
    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return Response.json({ error: "Failed to create project" }, { status: 500 });
  }
}
