import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "orchidBudsSchool"; // ⚠️ Change this! Store securely in .env file

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing credentials" },
        { status: 400 }
      );
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { email, name: "Admin User", isAuthenticated: true },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return NextResponse.json({
      success: true,
      user: { email, name: "Admin User", isAuthenticated: true },
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
