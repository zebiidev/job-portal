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

    const companyId = session.user.id;

    // Total Jobs
    const [totalJobsRes] = await db.execute(
      "SELECT COUNT(*) as count FROM jobs WHERE company_id = ?",
      [companyId]
    );
    const totalJobs = totalJobsRes[0]?.count || 0;

    // Active Jobs
    const [activeJobsRes] = await db.execute(
      "SELECT COUNT(*) as count FROM jobs WHERE company_id = ? AND status = 'active'",
      [companyId]
    );
    const activeJobs = activeJobsRes[0]?.count || 0;

    // Total Applicants
    const [totalApplicantsRes] = await db.execute(
      `SELECT COUNT(a.id) as count 
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE j.company_id = ?`,
      [companyId]
    );
    const totalApplicants = totalApplicantsRes[0]?.count || 0;

    // New Applicants Today
    const [newTodayRes] = await db.execute(
      `SELECT COUNT(a.id) as count 
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE j.company_id = ? AND DATE(a.applied_at) = CURDATE()`,
      [companyId]
    );
    const newToday = newTodayRes[0]?.count || 0;

    // Recent Jobs
    const [recentJobs] = await db.execute(
      `SELECT j.id, j.title, j.status, j.created_at,
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applicant_count
       FROM jobs j
       WHERE j.company_id = ?
       ORDER BY j.created_at DESC
       LIMIT 5`,
      [companyId]
    );

    // Latest Applicants
    const [latestApplicants] = await db.execute(
      `SELECT a.id, u.name as candidate_name, j.title as job_title, a.status, a.applied_at
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN \`user\` u ON a.user_id = u.id
       WHERE j.company_id = ?
       ORDER BY a.applied_at DESC
       LIMIT 5`,
      [companyId]
    );

    return NextResponse.json({
      stats: {
        totalJobs,
        activeJobs,
        totalApplicants,
        newToday,
      },
      recentJobs,
      latestApplicants,
    }, { status: 200 });
  } catch (error) {
    console.error("Company dashboard stats error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
