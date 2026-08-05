import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const payload = getUserFromRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  await connectToDatabase();
  const user = await User.findById(payload.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email },
  });
}
