import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/require-admin";

export async function GET() {
  try {
    const payload = await requireAdmin();
    return NextResponse.json({ email: payload.email, role: payload.role });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }
}
