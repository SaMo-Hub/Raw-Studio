import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Récupérer toutes les clés (RAW-SPORT et ADMIN)
    const accessKeys = await prisma.accessKey.findMany({
      select: {
        id: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(accessKeys, { status: 200 });
  } catch (error) {
    console.error("Error fetching access keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch access keys" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { password, name, role } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Valider le rôle
    const validRole = (role === "ADMIN" || role === "RAW-SPORT") ? role : "RAW-SPORT";

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer la clé d'accès
    const newKey = await prisma.accessKey.create({
      data: {
        value: hashedPassword,
        password: password, // Stocker le mot de passe en clair
        name: name || null,
        role: validRole,
        isActive: true,
      },
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

    return NextResponse.json(newKey, { status: 201 });
  } catch (error) {
    console.error("Error creating access key:", error);
    return NextResponse.json(
      { error: "Failed to create access key" },
      { status: 500 }
    );
  }
}
