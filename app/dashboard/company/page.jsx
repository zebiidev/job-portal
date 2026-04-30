"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CompanyDashboardRightPanel() {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/company/dashboard");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-black">
            Welcome back, {session?.user?.name || "Company"} 👋
          </h2>
          <p className="text-gray-500 text-sm">
            Here’s what’s happening with your jobs today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Jobs" value={data?.stats?.totalJobs || 0} />
          <StatCard title="Active Jobs" value={data?.stats?.activeJobs || 0} />
          <StatCard title="Applicants" value={data?.stats?.totalApplicants || 0} />
          <StatCard title="New Today" value={data?.stats?.newToday || 0} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Jobs */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-4 md:overflow-x-hidden overflow-x-auto">
            <h3 className="font-semibold text-lg mb-4">Recent Job Posts</h3>

            <table className="w-full text-sm min-w-[600px]">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-2">Job Title</th>
                  <th className="text-left py-2">Applicants</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.recentJobs?.length > 0 ? (
                  data.recentJobs.map((job) => (
                    <JobRow
                      key={job.id}
                      title={job.title}
                      applicants={job.applicant_count}
                      status={job.status}
                      posted={new Date(job.created_at).toLocaleDateString()}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      No jobs posted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Link href="/dashboard/company/my-jobs" className="inline-block mt-4 text-sm text-blue-600 hover:underline">
              View all jobs →
            </Link>
          </div>

          {/* Latest Applicants */}
          <div className="bg-white rounded-xl border p-4 space-y-4">
            <h3 className="font-semibold text-lg">Latest Applicants</h3>

            {data?.latestApplicants?.length > 0 ? (
              data.latestApplicants.map((app) => (
                <Applicant
                  key={app.id}
                  name={app.candidate_name}
                  role={app.job_title}
                  status={app.status}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent applicants.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/company/post-job">
            <ActionCard
              title="Post a New Job"
              description="Create and publish a new job listing"
              btnText="Post Job"
            />
          </Link>
          <Link href="/dashboard/company/profile">
            <ActionCard
              title="Complete Company Profile"
              description="Add logo, description & details"
              btnText="Update Profile"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Small Components ------------------ */

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl border p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-semibold mt-1">{value}</h3>
  </div>
);

const JobRow = ({ title, applicants, status, posted }) => (
  <tr>
    <td className="py-3 font-medium">{title}</td>
    <td>{applicants}</td>
    <td>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
          status === "active"
            ? "bg-green-100 text-green-700"
            : status === "closed"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    </td>
    <td className="text-gray-500">{posted}</td>
  </tr>
);

const Applicant = ({ name, role, status }) => (
  <div className="flex justify-between items-center border rounded-lg p-3">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-xs text-gray-500 truncate max-w-[120px]">{role}</p>
    </div>
    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
      status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
      status === 'interview' ? 'bg-blue-100 text-blue-700' :
      status === 'rejected' ? 'bg-red-100 text-red-700' :
      'bg-green-100 text-green-700'
    }`}>
      {status}
    </span>
  </div>
);

const ActionCard = ({ title, description, btnText }) => (
  <div className="bg-white rounded-xl border p-4 flex justify-between items-center hover:shadow-md transition">
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button className="px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg text-sm transition">
      {btnText}
    </button>
  </div>
);
