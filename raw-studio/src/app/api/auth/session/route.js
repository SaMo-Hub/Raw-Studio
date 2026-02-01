import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return Response.json({ isLoggedIn: false, role: null }, { status: 200 });
  }

  return Response.json({
    isLoggedIn: true,
    role: session.role,
    id: session.id,
  });
}
