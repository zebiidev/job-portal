import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "company") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await db.execute(
      "SELECT * FROM company_profiles WHERE user_id = ? LIMIT 1",
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
    console.error("Fetch company profile error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "company") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { company_name, description, website, logo, industry, company_size, location, founded_year, phone } = await req.json();

    if (!company_name) {
      return NextResponse.json({ message: "Company name is required" }, { status: 400 });
    }

    const [existing] = await db.execute(
      "SELECT id FROM company_profiles WHERE user_id = ? LIMIT 1",
      [session.user.id]
    );

    if (existing.length > 0) {
      await db.execute(
        `UPDATE company_profiles SET company_name=?, description=?, website=?, logo=?, industry=?, company_size=?, location=?, founded_year=?, phone=? WHERE user_id=?`,
        [company_name, description || null, website || null, logo || null, industry || null, company_size || null, location || null, founded_year || null, phone || null, session.user.id]
      );
    } else {
      await db.execute(
        `INSERT INTO company_profiles (user_id, company_name, description, website, logo, industry, company_size, location, founded_year, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [session.user.id, company_name, description || null, website || null, logo || null, industry || null, company_size || null, location || null, founded_year || null, phone || null]
      );
    }

    return NextResponse.json({ message: "Company profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update company profile error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
