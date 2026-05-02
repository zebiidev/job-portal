import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const workType = searchParams.get("workType") || "";
    const level = searchParams.get("level") || "";
    const location = searchParams.get("location") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    let query = `
      SELECT j.*, u.name as company_name,
        cp.logo as company_logo, cp.industry, cp.company_size
      FROM jobs j
      LEFT JOIN \`user\` u ON j.company_id = u.id
      LEFT JOIN company_profiles cp ON j.company_id = cp.user_id
      WHERE j.status = 'active'
    `;
    const params = [];

    if (search) {
      query += ` AND (j.title LIKE ? OR j.location LIKE ? OR j.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (type) {
      query += ` AND j.emp_type = ?`;
      params.push(type);
    }
    if (workType) {
      query += ` AND j.work_type = ?`;
      params.push(workType);
    }
    if (level) {
      query += ` AND j.job_level = ?`;
      params.push(level);
    }
    if (location) {
      query += ` AND j.location LIKE ?`;
      params.push(`%${location}%`);
    }

    // Get total count
    const countQuery = query.replace(
      /SELECT j\.\*.*?FROM/,
      "SELECT COUNT(*) as total FROM"
    );
    const [countRows] = await db.execute(countQuery, params);
    const total = countRows[0]?.total || 0;

    query += ` ORDER BY j.created_at DESC LIMIT ? OFFSET ?`;
    params.push(String(limit), String(offset));

    const [jobs] = await db.execute(query, params);

    // Fetch tags for each job
    if (jobs.length > 0) {
      const jobIds = jobs.map((j) => j.id);
      const placeholders = jobIds.map(() => "?").join(",");
      const [tags] = await db.execute(
        `SELECT job_id, tag FROM tags WHERE job_id IN (${placeholders})`,
        jobIds.map(String)
      );

      const tagMap = {};
      tags.forEach((t) => {
        if (!tagMap[t.job_id]) tagMap[t.job_id] = [];
        tagMap[t.job_id].push(t.tag);
      });

      jobs.forEach((job) => {
        job.tags = tagMap[job.id] || [];
      });
    }

    return NextResponse.json(
      {
        jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      ["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT", "EHOSTUNREACH"].includes(
        error.code,
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Database unavailable. Start MySQL and verify DB_* env vars in .env.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
