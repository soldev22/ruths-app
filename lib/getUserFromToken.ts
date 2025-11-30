// lib/getUserFromToken.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export interface DecodedAuthToken {
  userId: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * Decode and verify the auth token (JWT) and return the payload.
 * Returns null if token is missing or invalid.
 */
export function getUserFromToken(
  token: string | undefined | null
): DecodedAuthToken | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedAuthToken;
    if (!decoded.userId) {
      return null;
    }
    return decoded;
  } catch (err) {
    console.error("Error verifying auth token:", err);
    return null;
  }
}
