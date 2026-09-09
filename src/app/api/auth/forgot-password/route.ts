import { NextResponse } from "next/server";
import { User, PasswordResetToken } from "@/models";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Account with this email does not exist." }, { status: 404 });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    // Delete any existing tokens for this email
    await PasswordResetToken.destroy({
      where: { email },
    });

    // Create new token
    await PasswordResetToken.create({
      email,
      token,
      expires,
    });

    // Send email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ message: "Reset link sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
