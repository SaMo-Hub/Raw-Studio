import prisma from "@/lib/db";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return Response.json({ error: "Item ID is required" }, { status: 400 });
    }

    const item = await prisma.rawSportGalleryItem.findUnique({
      where: { id },
    });

    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    return Response.json(item);
  } catch (error) {
    console.error("Get gallery item error:", error);
    return Response.json({ error: "Failed to fetch gallery item", details: error.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { imageName, imageUrl, category, isActive, displayOrder } = await request.json();

    if (category && !["photo", "graphic-design", "film"].includes(category)) {
      return Response.json({ error: "Invalid category. Must be 'photo', 'graphic-design', or 'film'" }, { status: 400 });
    }

    const item = await prisma.rawSportGalleryItem.update({
      where: { id },
      data: {
        ...(imageName && { imageName }),
        ...(imageUrl && { imageUrl }),
        ...(category && { category }),
        ...(isActive !== undefined && { isActive }),
        ...(displayOrder !== undefined && { displayOrder }),
      },
    });

    return Response.json(item);
  } catch (error) {
    console.error("Update gallery item error:", error);
    return Response.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    
    await prisma.rawSportGalleryItem.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return Response.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
