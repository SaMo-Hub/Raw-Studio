import prisma from "@/lib/db";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = params?.id;
    
    console.log("API GET - Raw params:", context.params);
    console.log("API GET - Resolved params:", params);
    console.log("API GET - ID:", id);
    
    if (!id) {
      return Response.json({ error: "Project ID is required", details: "params: " + JSON.stringify(params) }, { status: 400 });
    }
    
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const response = Response.json(project);
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return response;
  } catch (error) {
    console.error("Get project error:", error);
    return Response.json({ 
      error: "Failed to fetch project",
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { title, slug, shortDesc, longDesc, images, technologies, externalLink, featured, displayOrder, isActive } =
      await request.json();

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(shortDesc && { shortDesc }),
        ...(longDesc && { longDesc }),
        ...(images && { images: typeof images === "string" ? images : JSON.stringify(images) }),
        ...(technologies && { technologies: typeof technologies === "string" ? technologies : JSON.stringify(technologies) }),
        ...(externalLink !== undefined && { externalLink }),
        ...(featured !== undefined && { featured }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

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
    await prisma.project.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return Response.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
