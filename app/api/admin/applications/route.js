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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;
    const status = searchParams.get("status") || "";

    let query = `
      SELECT a.*, j.title as job_title, j.location as job_location,
        u.name as applicant_name, u.email as applicant_email,
        cu.name as company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN \`user\` u ON a.user_id = u.id
      LEFT JOIN \`user\` cu ON j.company_id = cu.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += " AND a.status = ?";
      params.push(status);
    }

    const countQuery = query.replace(/SELECT a\.\*.*?FROM/, "SELECT COUNT(*) as total FROM");
    const [countRows] = await db.execute(countQuery, params);
    const total = countRows[0]?.total || 0;

    query += " ORDER BY a.applied_at DESC LIMIT ? OFFSET ?";
    params.push(String(limit), String(offset));

    const [applications] = await db.execute(query, params);

    return NextResponse.json({
      applications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, { status: 200 });
  } catch (error) {
    console.error("Admin applications error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
