import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production-12345"
);

export async function GET(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const { id, role } = verified.payload;

    return NextResponse.json({ id, role }, { status: 200 });
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
