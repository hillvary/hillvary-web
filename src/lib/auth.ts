import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface AdminTokenPayload {
  sub: string;
  email: string;
  role: "ADMIN";
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, getSecret()) as AdminTokenPayload;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export const ADMIN_COOKIE_NAME = "hillvary_admin_token";
