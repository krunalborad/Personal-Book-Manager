import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // password has `select: false` on the schema, so it must be requested explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // Same generic error whether the email doesn't exist or the password is
    // wrong, so we don't leak which emails are registered.
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user._id.toString() });

    const response = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong while logging in." },
      { status: 500 }
    );
  }
}
