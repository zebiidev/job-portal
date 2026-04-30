import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.id, u.name, u.email, u.image as logo,
             cp.industry, cp.company_size, cp.location,
             (SELECT COUNT(*) FROM jobs WHERE company_id = u.id) as jobs_count
      FROM \`user\` u
      LEFT JOIN company_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'company'
    `;
    const params = [];

    if (search) {
      query += " AND (u.name LIKE ? OR u.email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const countQuery = query.replace(/SELECT u\.id.*?FROM/, "SELECT COUNT(*) as total FROM");
    const [countRows] = await db.execute(countQuery, params);
    const total = countRows[0]?.total || 0;

    query += " ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
    params.push(String(limit), String(offset));

    const [companies] = await db.execute(query, params);

    return NextResponse.json({
      companies,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, { status: 200 });
  } catch (error) {
    console.error("Admin companies error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
