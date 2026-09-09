import { NextResponse } from "next/server";
import { User } from "@/models";
import bcrypt from "bcryptjs";
import { sendAdminNewStudentAlert } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'TUTOR' ? 'TUTOR' : 'STUDENT',
    });

    if (user.role === "STUDENT") {
      sendAdminNewStudentAlert(user.email, user.name || "Unknown").catch(err => console.error("Failed to send student alert", err));
    }

    return NextResponse.json(
      { message: "User registered successfully", user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}