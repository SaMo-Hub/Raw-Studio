import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { data: accessKeys, error } = await supabaseAdmin
      .from("AccessKey")
      .select("id, password, name, role, isActive, createdAt, expiresAt")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(accessKeys, { status: 200 });
  } catch (error) {
    console.error("Error fetching access keys:", error);
    return NextResponse.json({ error: "Failed to fetch access keys" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { password, name, role } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const validRole = (role === "ADMIN" || role === "RAW-SPORT") ? role : "RAW-SPORT";
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newKey, error } = await supabaseAdmin
      .from("AccessKey")
      .insert({
        value: hashedPassword,
        password,
        name: name || null,
        role: validRole,
        isActive: true,
      })
      .select("id, password, name, role, isActive, createdAt, expiresAt")
      .single();

    if (error) throw error;
    return NextResponse.json(newKey, { status: 201 });
  } catch (error) {
    console.error("Error creating access key:", error);
    return NextResponse.json({ error: "Failed to create access key" }, { status: 500 });
  }
}
