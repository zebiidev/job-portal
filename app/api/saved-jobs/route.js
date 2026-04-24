import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { job_id } = await req.json();
    if (!job_id) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    // Check if already saved
    const [existing] = await db.execute(
      "SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ? LIMIT 1",
      [session.user.id, job_id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ message: "Job already saved" }, { status: 400 });
    }

    await db.execute(
      "INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)",
      [session.user.id, job_id]
    );

    return NextResponse.json({ message: "Job saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Save job error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [savedJobs] = await db.execute(
      `SELECT sj.id as saved_id, sj.saved_at, j.*,
        u.name as company_name, cp.logo as company_logo
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      LEFT JOIN \`user\` u ON j.company_id = u.id
      LEFT JOIN company_profiles cp ON j.company_id = cp.user_id
      WHERE sj.user_id = ?
      ORDER BY sj.saved_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ savedJobs }, { status: 200 });
  } catch (error) {
    console.error("Fetch saved jobs error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("job_id");

    if (!jobId) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    await db.execute(
      "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?",
      [session.user.id, jobId]
    );

    return NextResponse.json({ message: "Job unsaved" }, { status: 200 });
  } catch (error) {
    console.error("Unsave job error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
