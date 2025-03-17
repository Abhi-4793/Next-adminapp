import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword, repeatPassword } = await req.json();

    if (!currentPassword || !newPassword || !repeatPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== repeatPassword) {
      return NextResponse.json(
        { message: "New password and repeat password must match" },
        { status: 400 }
      );
    }

    console.log("Password changed successfully!");

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
