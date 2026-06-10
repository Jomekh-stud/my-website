import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const code = body?.code;
  const expectedCode = process.env.EVENT_ADMIN_CODE;

  if (!expectedCode || typeof code !== "string" || code !== expectedCode) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const token = signAdminToken({
    role: "admin",
    exp: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  return NextResponse.json({ success: true, token });
}
