import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Récupérer toutes les clés SERVICE
    const serviceKeys = await prisma.accessKey.findMany({
      where: { role: "SERVICE" },
      select: {
        id: true,
        value: true,
        isActive: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(serviceKeys, { status: 200 });
  } catch (error) {
    console.error("Error fetching service keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch service keys" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { password, expiresAt } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer la clé d'accès SERVICE
    const newKey = await prisma.accessKey.create({
      data: {
        value: hashedPassword,
        role: "SERVICE",
        isActive: true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      select: {
        id: true,
        isActive: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    return NextResponse.json(newKey, { status: 201 });
  } catch (error) {
    console.error("Error creating service key:", error);
    return NextResponse.json(
      { error: "Failed to create service key" },
      { status: 500 }
    );
  }
}
