"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/user/dashboard");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const stats = [
    { label: "Applications", value: data?.stats?.totalApplications || 0, icon: "📄" },
    { label: "Interviews", value: data?.stats?.totalInterviews || 0, icon: "📅" },
    { label: "Saved Jobs", value: data?.stats?.totalSavedJobs || 0, icon: "❤️" },
  ];

  return (
    <div className="min-h-screen rounded-md bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {session?.user?.name || "User"}!
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
              <span className="text-2xl">{item.icon}</span>
            </div>
          ))}

          {/* Profile Completion - Mock for now as it needs profile calculation */}
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile</p>
              <p className="text-xl font-bold">80% Complete</p>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-emerald-500 flex items-center justify-center text-sm font-semibold text-emerald-600">
              80%
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-4">Recent Applications</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="pb-2">Job Title</th>
                    <th className="pb-2">Company</th>
                    <th className="pb-2">Applied</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {data?.recentApplications?.length > 0 ? (
                    data.recentApplications.map((app) => (
                      <tr key={app.id} className="border-t">
                        <td className="py-3">{app.job_title}</td>
                        <td className="py-3">{app.company_name || "Unknown"}</td>
                        <td className="py-3">{new Date(app.applied_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded capitalize
                            ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              app.status === 'interview' ? 'bg-blue-100 text-blue-700' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">
                        No recent applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Link href="/dashboard/user/applications" className="inline-block text-blue-600 text-sm mt-3 hover:underline">
              View All →
            </Link>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Interview */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-2">Upcoming Interview</h2>
              {data?.stats?.totalInterviews > 0 ? (
                <>
                  <p className="text-sm text-gray-600">You have scheduled interviews!</p>
                  <p className="text-sm text-gray-500 mt-1">Check your emails for details.</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No upcoming interviews at the moment.</p>
              )}
            </div>

            {/* Complete Profile */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold mb-1">Complete Your Profile</h2>
                <p className="text-sm text-gray-500">
                  Update your resume & details
                </p>
              </div>
              <Link href="/dashboard/user/profile">
                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
                  Complete Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
