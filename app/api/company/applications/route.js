import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "company") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("job_id");

    let query = `
      SELECT a.*, j.title as job_title, u.name as applicant_name, u.email as applicant_email,
        up.phone, up.title as applicant_title, up.resume_url as profile_resume, up.linkedin, up.github
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN \`user\` u ON a.user_id = u.id
      LEFT JOIN user_profiles up ON a.user_id = up.user_id
      WHERE j.company_id = ?
    `;
    const params = [session.user.id];

    if (jobId) {
      query += ` AND a.job_id = ?`;
      params.push(jobId);
    }

    query += ` ORDER BY a.applied_at DESC`;

    const [applications] = await db.execute(query, params);

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("Fetch company applications error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "company") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { application_id, status } = await req.json();
    const validStatuses = ["pending", "reviewed", "shortlisted", "interview", "rejected", "accepted"];

    if (!application_id || !status || !validStatuses.includes(status)) {
      return NextResponse.json({ message: "Valid application ID and status are required" }, { status: 400 });
    }

    // Verify this application belongs to one of the company's jobs
    const [check] = await db.execute(
      `SELECT a.id FROM applications a 
       JOIN jobs j ON a.job_id = j.id 
       WHERE a.id = ? AND j.company_id = ?`,
      [application_id, session.user.id]
    );

    if (check.length === 0) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    await db.execute(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, application_id]
    );

    return NextResponse.json({ message: "Application status updated" }, { status: 200 });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
