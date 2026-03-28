import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from("Project")
      .select("*")
      .order("displayOrder", { ascending: true });

    if (error) throw error;
    return Response.json(projects);
  } catch (error) {
    console.error("Get all projects error:", error);
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
