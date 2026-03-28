import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { password, name, role, isActive } = await request.json();

    const { data: key } = await supabaseAdmin
      .from("AccessKey")
      .select("id")
      .eq("id", id)
      .single();

    if (!key) {
      return NextResponse.json({ error: "Service key not found" }, { status: 404 });
    }

    const updateData = {};

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      updateData.value = await bcrypt.hash(password, 10);
      updateData.password = password;
    }

    if (name !== undefined) updateData.name = name || null;
    if (role !== undefined) updateData.role = role || "RAW-SPORT";
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    const { data: updated, error } = await supabaseAdmin
      .from("AccessKey")
      .update(updateData)
      .eq("id", id)
      .select("id, password, name, role, isActive, createdAt, expiresAt")
      .single();

    if (error) throw error;
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating service key:", error);
    return NextResponse.json({ error: "Failed to update service key" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    const { data: key } = await supabaseAdmin
      .from("AccessKey")
      .select("id")
      .eq("id", id)
      .single();

    if (!key) {
      return NextResponse.json({ error: "Service key not found" }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from("AccessKey")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ message: "Service key deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting service key:", error);
    return NextResponse.json({ error: "Failed to delete service key" }, { status: 500 });
  }
}
