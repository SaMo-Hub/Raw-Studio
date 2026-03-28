import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "raw-studio-media";
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_TYPES = [
  "image/",
  "video/",
  "image/gif",
];

export async function POST(request) {
  try {
    const sessionResponse = await fetch(
      new URL("/api/auth/session", request.url),
      { headers: { cookie: request.headers.get("cookie") || "" } }
    );

    if (!sessionResponse.ok) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await sessionResponse.json();
    if (!session.isLoggedIn || session.role !== "ADMIN") {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const isAllowed = ALLOWED_TYPES.some((type) => file.type.startsWith(type));
    if (!isAllowed) {
      return Response.json({ error: "Type de fichier non autorisé" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: "Fichier trop volumineux (max 50MB)" }, { status: 400 });
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${randomString}-${file.name}`;

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return Response.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }

    const publicUrl = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path).data.publicUrl;

    return Response.json({ success: true, url: publicUrl, filename: data.path });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
