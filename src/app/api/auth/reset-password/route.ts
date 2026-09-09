import { NextResponse } from "next/server";
import { User, PasswordResetToken } from "@/models";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find token in DB
    const resetTokenRecord = await PasswordResetToken.findOne({
      where: { token },
    });

    if (!resetTokenRecord) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Check expiration
    if (new Date() > resetTokenRecord.expires) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.update({ password: hashedPassword }, {
      where: { email: resetTokenRecord.email },
    });

    // Delete used token
    await PasswordResetToken.destroy({
      where: { id: resetTokenRecord.id },
    });

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
