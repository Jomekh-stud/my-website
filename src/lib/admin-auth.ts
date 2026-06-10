import { createHmac, timingSafeEqual } from "crypto";

type AdminTokenPayload = {
  role: "admin";
  exp: number;
};

function base64UrlEncode(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  return Buffer.from(base64, "base64");
}

function getSecret() {
  const secret = process.env.EVENT_ADMIN_SECRET;
  if (!secret) {
    throw new Error("EVENT_ADMIN_SECRET environment variable is required for admin auth.");
  }
  return secret;
}

export function signAdminToken(payload: AdminTokenPayload) {
  const secret = getSecret();
  const encodedPayload = base64UrlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
  const signature = createHmac("sha256", secret).update(encodedPayload).digest();
  return `${encodedPayload}.${base64UrlEncode(signature)}`;
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const secret = getSecret();
    const [encodedPayload, encodedSignature] = token.split(".");
    if (!encodedPayload || !encodedSignature) {
      return null;
    }

    const expectedSignature = createHmac("sha256", secret).update(encodedPayload).digest();
    const actualSignature = base64UrlDecode(encodedSignature);
    if (expectedSignature.length !== actualSignature.length) {
      return null;
    }

    if (!timingSafeEqual(expectedSignature, actualSignature)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString("utf8"));
    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}
