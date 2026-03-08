import prisma from "@/lib/db";

export async function GET() {
  try {
    // Get all home items sorted by type and display order
    const items = await prisma.rawSportHomeItem.findMany({
      where: { isActive: true },
      orderBy: [{ type: "asc" }, { displayOrder: "asc" }],
    });
    return Response.json(items);
  } catch (error) {
    console.error("Get raw-sport home items error:", error);
    return Response.json({ error: "Failed to fetch home items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { imageName, imageUrl, type, isActive, displayOrder } = await request.json();

    if (!imageName || !imageUrl || !type) {
      return Response.json({ error: "imageName, imageUrl, and type required" }, { status: 400 });
    }

    if (!["athletes", "press", "clubs"].includes(type)) {
      return Response.json({ error: "Invalid type. Must be 'athletes', 'press', or 'clubs'" }, { status: 400 });
    }

    const item = await prisma.rawSportHomeItem.create({
      data: {
        imageName,
        imageUrl,
        type,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder || 0,
      },
    });

    return Response.json(item, { status: 201 });
  } catch (error) {
    console.error("Create home item error:", error);
    return Response.json({ error: "Failed to create home item" }, { status: 500 });
  }
}
