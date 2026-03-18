import { createHmac, randomBytes, randomUUID } from "node:crypto";
import type { CookieOptions } from "express";
import type { SessionRecord } from "./repository";

const SESSION_COOKIE_NAME = "foodwise_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function hashSessionToken(token: string, sessionSecret: string) {
  return createHmac("sha256", sessionSecret).update(token).digest("hex");
}

export function createSessionRecord(userId: string, sessionSecret: string): {
  session: SessionRecord;
  token: string;
} {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  return {
    token,
    session: {
      id: randomUUID(),
      userId,
      tokenHash: hashSessionToken(token, sessionSecret),
      expiresAt,
    },
  };
}

function getCookieSameSite(secureCookie: boolean): CookieOptions["sameSite"] {
  return secureCookie ? "none" : "lax";
}

export function getSessionCookieOptions(expiresAt: string, secureCookie: boolean): CookieOptions {
  return {
    httpOnly: true,
    sameSite: getCookieSameSite(secureCookie),
    ...(secureCookie ? { secure: true } : {}),
    path: "/",
    expires: new Date(expiresAt),
  };
}

export function getExpiredCookieOptions(secureCookie: boolean): CookieOptions {
  return {
    httpOnly: true,
    sameSite: getCookieSameSite(secureCookie),
    ...(secureCookie ? { secure: true } : {}),
    path: "/",
    expires: new Date(0),
  };
}
