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
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    let query = `
      SELECT j.*, u.name as company_name,
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applicant_count
      FROM jobs j
      LEFT JOIN \`user\` u ON j.company_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += " AND (j.title LIKE ? OR j.location LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      query += " AND j.status = ?";
      params.push(status);
    }

    const countQuery = query.replace(/SELECT j\.\*.*?FROM/, "SELECT COUNT(*) as total FROM");
    const [countRows] = await db.execute(countQuery, params);
    const total = countRows[0]?.total || 0;

    query += " ORDER BY j.created_at DESC LIMIT ? OFFSET ?";
    params.push(String(limit), String(offset));

    const [jobs] = await db.execute(query, params);

    return NextResponse.json({
      jobs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, { status: 200 });
  } catch (error) {
    console.error("Admin jobs error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    const [result] = await db.execute("DELETE FROM jobs WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job deleted" }, { status: 200 });
  } catch (error) {
    console.error("Admin delete job error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
