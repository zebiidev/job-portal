import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await db.execute(
      "SELECT * FROM user_profiles WHERE user_id = ? LIMIT 1",
      [session.user.id]
    );

    const [userRows] = await db.execute(
      "SELECT name, email, image FROM `user` WHERE id = ? LIMIT 1",
      [session.user.id]
    );

    return NextResponse.json({
      profile: rows[0] || null,
      user: userRows[0] || null,
    }, { status: 200 });
  } catch (error) {
    console.error("Fetch user profile error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { phone, title, bio, skills, experience, education, resume_url, linkedin, github, portfolio, location } = await req.json();

    // Check if profile exists
    const [existing] = await db.execute(
      "SELECT id FROM user_profiles WHERE user_id = ? LIMIT 1",
      [session.user.id]
    );

    if (existing.length > 0) {
      await db.execute(
        `UPDATE user_profiles SET phone=?, title=?, bio=?, skills=?, experience=?, education=?, resume_url=?, linkedin=?, github=?, portfolio=?, location=? WHERE user_id=?`,
        [phone || null, title || null, bio || null, skills || null, experience || null, education || null, resume_url || null, linkedin || null, github || null, portfolio || null, location || null, session.user.id]
      );
    } else {
      await db.execute(
        `INSERT INTO user_profiles (user_id, phone, title, bio, skills, experience, education, resume_url, linkedin, github, portfolio, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [session.user.id, phone || null, title || null, bio || null, skills || null, experience || null, education || null, resume_url || null, linkedin || null, github || null, portfolio || null, location || null]
      );
    }

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update user profile error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
