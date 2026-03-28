import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return Response.json({ error: "Item ID is required" }, { status: 400 });
    }

    const { data: item, error } = await supabaseAdmin
      .from("RawSportHomeItem")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    return Response.json(item);
  } catch (error) {
    console.error("Get home item error:", error);
    return Response.json({ error: "Failed to fetch home item", details: error.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { imageName, imageUrl, type, client, isActive, displayOrder } = await request.json();

    if (type && !["athletes", "press", "clubs"].includes(type)) {
      return Response.json({ error: "Invalid type. Must be 'athletes', 'press', or 'clubs'" }, { status: 400 });
    }

    const { data: item, error } = await supabaseAdmin
      .from("RawSportHomeItem")
      .update({
        ...(imageName && { imageName }),
        ...(imageUrl && { imageUrl }),
        ...(type && { type }),
        ...(client !== undefined && { client: client || null }),
        ...(isActive !== undefined && { isActive }),
        ...(displayOrder !== undefined && { displayOrder }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return Response.json(item);
  } catch (error) {
    console.error("Update home item error:", error);
    return Response.json({ error: "Failed to update home item" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    const { error } = await supabaseAdmin
      .from("RawSportHomeItem")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete home item error:", error);
    return Response.json({ error: "Failed to delete home item" }, { status: 500 });
  }
}
