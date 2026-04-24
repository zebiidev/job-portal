import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "job-seeker") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { job_id, cover_letter, resume_url } = await req.json();

    if (!job_id) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    // Check if already applied
    const [existing] = await db.execute(
      "SELECT id FROM applications WHERE user_id = ? AND job_id = ? LIMIT 1",
      [session.user.id, job_id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ message: "You have already applied for this job" }, { status: 400 });
    }

    // Check if job exists and is active
    const [job] = await db.execute(
      "SELECT id, status FROM jobs WHERE id = ? LIMIT 1",
      [job_id]
    );

    if (job.length === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    if (job[0].status !== "active") {
      return NextResponse.json({ message: "This job is no longer accepting applications" }, { status: 400 });
    }

    await db.execute(
      "INSERT INTO applications (user_id, job_id, cover_letter, resume_url, status) VALUES (?, ?, ?, ?, 'pending')",
      [session.user.id, job_id, cover_letter || null, resume_url || null]
    );

    return NextResponse.json({ message: "Application submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Application submit error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [applications] = await db.execute(
      `SELECT a.*, j.title as job_title, j.location as job_location, 
        j.emp_type, j.min_salary, j.max_salary, j.currency,
        u.name as company_name, cp.logo as company_logo
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      LEFT JOIN \`user\` u ON j.company_id = u.id
      LEFT JOIN company_profiles cp ON j.company_id = cp.user_id
      WHERE a.user_id = ?
      ORDER BY a.applied_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
