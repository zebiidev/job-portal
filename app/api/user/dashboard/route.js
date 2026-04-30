import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "job-seeker") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get Total Applications
    const [appCountRes] = await db.execute(
      "SELECT COUNT(*) as count FROM applications WHERE user_id = ?",
      [userId]
    );
    const totalApplications = appCountRes[0]?.count || 0;

    // Get Interviews (Applications with status 'interview')
    const [interviewCountRes] = await db.execute(
      "SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = 'interview'",
      [userId]
    );
    const totalInterviews = interviewCountRes[0]?.count || 0;

    // Get Saved Jobs
    const [savedJobsRes] = await db.execute(
      "SELECT COUNT(*) as count FROM saved_jobs WHERE user_id = ?",
      [userId]
    );
    const totalSavedJobs = savedJobsRes[0]?.count || 0;

    // Get Recent Applications
    const [recentApplications] = await db.execute(
      `SELECT a.id, j.title as job_title, u.name as company_name, a.applied_at, a.status 
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       LEFT JOIN \`user\` u ON j.company_id = u.id
       WHERE a.user_id = ?
       ORDER BY a.applied_at DESC
       LIMIT 5`,
      [userId]
    );

    return NextResponse.json({
      stats: {
        totalApplications,
        totalInterviews,
        totalSavedJobs,
      },
      recentApplications,
    }, { status: 200 });
  } catch (error) {
    console.error("User dashboard stats error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
