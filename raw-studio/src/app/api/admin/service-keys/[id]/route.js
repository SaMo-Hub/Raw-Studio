import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { password, name, role, isActive } = await request.json();

    console.log("PUT /api/admin/service-keys/[id]", { id, password, name, role, isActive });

    const key = await prisma.accessKey.findUnique({
      where: { id },
    });

    if (!key) {
      console.log("Key not found:", id);
      return NextResponse.json(
        { error: "Service key not found" },
        { status: 404 }
      );
    }

    const updateData = {};

    // Si on veut changer le mot de passe
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      updateData.value = await bcrypt.hash(password, 10);
      updateData.password = password;
    }

    // Si on veut changer le nom
    if (name !== undefined) {
      updateData.name = name || null;
    }

    // Si on veut changer le rôle - accept RAW-SPORT, ADMIN, or any other value
    if (role !== undefined) {
      updateData.role = role || "RAW-SPORT";
    }

    // Si on veut changer le statut
    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    console.log("Update data:", updateData);

    const updated = await prisma.accessKey.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    console.log("Updated successfully:", updated);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating service key:", error);
    return NextResponse.json(
      { error: "Failed to update service key" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    const key = await prisma.accessKey.findUnique({
      where: { id },
    });

    if (!key) {
      return NextResponse.json(
        { error: "Service key not found" },
        { status: 404 }
      );
    }

    await prisma.accessKey.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Service key deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service key:", error);
    return NextResponse.json(
      { error: "Failed to delete service key" },
      { status: 500 }
    );
  }
}
