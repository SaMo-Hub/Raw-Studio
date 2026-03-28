import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: items, error } = await supabaseAdmin
      .from("RawSportHomeItem")
      .select("*")
      .eq("isActive", true)
      .order("type", { ascending: true })
      .order("displayOrder", { ascending: true });

    if (error) throw error;
    return Response.json(items);
  } catch (error) {
    console.error("Get raw-sport home items error:", error);
    return Response.json({ error: "Failed to fetch home items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { imageName, imageUrl, type, client, isActive, displayOrder } = await request.json();

    if (!imageName || !imageUrl || !type) {
      return Response.json({ error: "imageName, imageUrl, and type required" }, { status: 400 });
    }

    if (!["athletes", "press", "clubs"].includes(type)) {
      return Response.json({ error: "Invalid type. Must be 'athletes', 'press', or 'clubs'" }, { status: 400 });
    }

    const { data: item, error } = await supabaseAdmin
      .from("RawSportHomeItem")
      .insert({
        imageName,
        imageUrl,
        type,
        client: client || null,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return Response.json(item, { status: 201 });
  } catch (error) {
    console.error("Create home item error:", error);
    return Response.json({ error: "Failed to create home item" }, { status: 500 });
  }
}
