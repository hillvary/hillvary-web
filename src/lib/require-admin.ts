import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminToken, type AdminTokenPayload } from "@/lib/auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export async function requireAdmin(): Promise<AdminTokenPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) throw new UnauthorizedError();

  try {
    return verifyAdminToken(token);
  } catch {
    throw new UnauthorizedError();
  }
}
