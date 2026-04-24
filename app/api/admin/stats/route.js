import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [[users]] = await db.execute("SELECT COUNT(*) as count FROM `user` WHERE role = 'job-seeker'");
    const [[companies]] = await db.execute("SELECT COUNT(*) as count FROM `user` WHERE role = 'company'");
    const [[jobs]] = await db.execute("SELECT COUNT(*) as count FROM jobs");
    const [[applications]] = await db.execute("SELECT COUNT(*) as count FROM applications");
    const [[activeJobs]] = await db.execute("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'");

    // Recent users
    const [recentUsers] = await db.execute(
      "SELECT id, name, email, role, created_at FROM `user` ORDER BY created_at DESC LIMIT 5"
    );

    // Recent jobs
    const [recentJobs] = await db.execute(
      `SELECT j.id, j.title, j.status, j.created_at, u.name as company_name
       FROM jobs j LEFT JOIN \`user\` u ON j.company_id = u.id
       ORDER BY j.created_at DESC LIMIT 5`
    );

    return NextResponse.json({
      stats: {
        totalUsers: users.count,
        totalCompanies: companies.count,
        totalJobs: jobs.count,
        totalApplications: applications.count,
        activeJobs: activeJobs.count,
      },
      recentUsers,
      recentJobs,
    }, { status: 200 });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
