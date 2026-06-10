import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const token = body?.token;
  if (typeof token !== "string") {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const payload = verifyAdminToken(token);
  if (!payload || payload.role !== "admin" || payload.exp < Date.now()) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
