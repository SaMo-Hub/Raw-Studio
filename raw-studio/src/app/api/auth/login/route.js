import { createToken } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return Response.json({ error: "Password required" }, { status: 400 });
    }

    // Récupérer tous les accessKeys actifs
    const allActiveKeys = await prisma.accessKey.findMany({
      where: { isActive: true },
    });

    let validKey = null;
    for (const key of allActiveKeys) {
      // Vérifier l'expiration
      if (key.expiresAt && new Date() > new Date(key.expiresAt)) {
        continue;
      }

      // Comparer le mot de passe
      const isValid = await bcrypt.compare(password, key.value);
      if (isValid) {
        validKey = key;
        break;
      }
    }

    if (!validKey) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    // Créer le JWT
    const token = await createToken({
      id: validKey.id,
      role: validKey.role,
      name: validKey.name,
    });

    // Définir le cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return Response.json({
      success: true,
      role: validKey.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
