import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "./constants";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error(
    "Missing JWT_SECRET environment variable. Add it to your .env.local file."
  );
}

export { AUTH_COOKIE_NAME };

export interface JwtPayload {
  userId: string;
}

export function signToken(payload: JwtPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET as string, options);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Reads the auth cookie off an incoming request and returns the decoded
 * payload, or null if there's no valid session. Used inside API routes
 * to identify "the current user" before touching their data.
 */
export function getUserFromRequest(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
