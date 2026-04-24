import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const [rows] = await db.execute(
      `SELECT j.*, u.name as company_name,
        cp.logo as company_logo, cp.industry, cp.company_size,
        cp.description as about_company, cp.website as company_website,
        cp.location as company_location
      FROM jobs j
      LEFT JOIN \`user\` u ON j.company_id = u.id
      LEFT JOIN company_profiles cp ON j.company_id = cp.user_id
      WHERE j.id = ?
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const job = rows[0];

    // Fetch tags
    const [tags] = await db.execute(
      `SELECT tag FROM tags WHERE job_id = ?`,
      [id]
    );
    job.tags = tags.map((t) => t.tag);

    // Fetch application count
    const [appCount] = await db.execute(
      `SELECT COUNT(*) as count FROM applications WHERE job_id = ?`,
      [id]
    );
    job.applicationCount = appCount[0]?.count || 0;

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
