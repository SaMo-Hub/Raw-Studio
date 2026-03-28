import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: items, error } = await supabaseAdmin
      .from("RawSportGalleryItem")
      .select("*")
      .eq("isActive", true)
      .order("category", { ascending: true })
      .order("displayOrder", { ascending: true });

    if (error) throw error;
    return Response.json(items);
  } catch (error) {
    console.error("Get raw-sport gallery items error:", error);
    return Response.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { imageName, imageUrl, category, isActive, displayOrder } = await request.json();

    if (!imageName || !imageUrl || !category) {
      return Response.json({ error: "imageName, imageUrl, and category required" }, { status: 400 });
    }

    if (!["photo", "graphic-design", "film"].includes(category)) {
      return Response.json({ error: "Invalid category. Must be 'photo', 'graphic-design', or 'film'" }, { status: 400 });
    }

    const { data: item, error } = await supabaseAdmin
      .from("RawSportGalleryItem")
      .insert({
        imageName,
        imageUrl,
        category,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return Response.json(item, { status: 201 });
  } catch (error) {
    console.error("Create gallery item error:", error);
    return Response.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}
