import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";

export async function PUT(req) {
  try {
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, currentPassword, newPassword } = await req.json();

    // Update name/email
    if (name || email) {
      const updates = [];
      const params = [];

      if (name) {
        updates.push("name = ?");
        params.push(name);
      }
      if (email) {
        // Check if email is taken by another user
        const [existing] = await db.execute(
          "SELECT id FROM `user` WHERE email = ? AND id != ? LIMIT 1",
          [email, session.user.id]
        );
        if (existing.length > 0) {
          return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
        }
        updates.push("email = ?");
        params.push(email);
      }

      if (updates.length > 0) {
        params.push(session.user.id);
        await db.execute(
          `UPDATE \`user\` SET ${updates.join(", ")} WHERE id = ?`,
          params
        );
      }
    }

    // Change password
    if (currentPassword && newPassword) {
      const [userRows] = await db.execute(
        "SELECT password FROM `user` WHERE id = ? LIMIT 1",
        [session.user.id]
      );

      if (userRows.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const isMatch = await bcrypt.compare(currentPassword, userRows[0].password);
      if (!isMatch) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ message: "New password must be at least 6 characters" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.execute(
        "UPDATE `user` SET password = ? WHERE id = ?",
        [hashedPassword, session.user.id]
      );
    }

    return NextResponse.json({ message: "Settings updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
