import prisma from "@/lib/db";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return Response.json({ error: "Item ID is required" }, { status: 400 });
    }

    const item = await prisma.rawSportHomeItem.findUnique({
      where: { id },
    });

    if (!item) {
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
    const { imageName, imageUrl, type, isActive, displayOrder } = await request.json();

    if (type && !["athletes", "press", "clubs"].includes(type)) {
      return Response.json({ error: "Invalid type. Must be 'athletes', 'press', or 'clubs'" }, { status: 400 });
    }

    const item = await prisma.rawSportHomeItem.update({
      where: { id },
      data: {
        ...(imageName && { imageName }),
        ...(imageUrl && { imageUrl }),
        ...(type && { type }),
        ...(isActive !== undefined && { isActive }),
        ...(displayOrder !== undefined && { displayOrder }),
      },
    });

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
    
    await prisma.rawSportHomeItem.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete home item error:", error);
    return Response.json({ error: "Failed to delete home item" }, { status: 500 });
  }
}
