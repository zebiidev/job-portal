import { db } from "@/config/connectDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "company") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      emp_type,
      work_type,
      job_level,
      location,
      education,
      experience,
      min_salary,
      max_salary,
      currency,
      salary_period,
      expiry_date,
      description,
      tags = [],
    } = await req.json();

    if (!title || !location || !description) {
      return NextResponse.json(
        { message: "Title, location and description are required" },
        { status: 400 },
      );
    }

    const [result] = await db.execute(
      `INSERT INTO jobs
      (company_id, title, emp_type, work_type, job_level, location, education, experience, min_salary, max_salary, currency, salary_period, expiry_date, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        session.user.id,
        title,
        emp_type || "full-time",
        work_type || "onsite",
        job_level || "junior",
        location,
        education || null,
        experience || 0,
        min_salary || null,
        max_salary || null,
        currency || "PKR",
        salary_period || "yearly",
        expiry_date || null,
        description,
      ],
    );

    const jobId = result.insertId;

    if (Array.isArray(tags) && tags.length > 0) {
      const tagValues = tags.filter(Boolean).map((tag) => [jobId, tag.trim()]);
      if (tagValues.length > 0) {
        await db.query("INSERT INTO tags (job_id, tag) VALUES ?", [tagValues]);
      }
    }

    return NextResponse.json(
      { message: "Job posted successfully", jobId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Post job error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "company") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [jobs] = await db.execute(
      `SELECT j.*,
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applicant_count
      FROM jobs j
      WHERE j.company_id = ?
      ORDER BY j.created_at DESC`,
      [session.user.id],
    );

    if (jobs.length > 0) {
      const jobIds = jobs.map((j) => j.id);
      const placeholders = jobIds.map(() => "?").join(",");
      const [tags] = await db.execute(
        `SELECT job_id, tag FROM tags WHERE job_id IN (${placeholders})`,
        jobIds.map(String),
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

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error("Fetch company jobs error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "company") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json(
        { message: "Job ID and status are required" },
        { status: 400 },
      );
    }

    const [result] = await db.execute(
      "UPDATE jobs SET status = ? WHERE id = ? AND company_id = ?",
      [status, id, session.user.id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job updated" }, { status: 200 });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user.role !== "company") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    const [result] = await db.execute(
      "DELETE FROM jobs WHERE id = ? AND company_id = ?",
      [id, session.user.id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

