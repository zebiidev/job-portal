"use client";
import React, { useEffect, useState } from "react";
import { Users, Building2, Briefcase, FileText, Loader2 } from "lucide-react";

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: data?.stats?.totalUsers || 0,
      icon: Users,
    },
    {
      title: "Companies",
      value: data?.stats?.totalCompanies || 0,
      icon: Building2,
    },
    {
      title: "Jobs Posted",
      value: data?.stats?.totalJobs || 0,
      icon: Briefcase,
    },
    {
      title: "Applications",
      value: data?.stats?.totalApplications || 0,
      icon: FileText,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Overview of platform activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {stat.value.toLocaleString()}
                  </h2>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Recent Users</h3>
            <span className="text-xs text-gray-400">Last 5</span>
          </div>
          <div className="divide-y max-h-[400px] overflow-auto">
            {data?.recentUsers?.length > 0 ? (
              data.recentUsers.map((user, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                    {user.role?.replace("-", " ")}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-gray-500 text-sm">No recent users found.</p>
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Recent Jobs</h3>
            <span className="text-xs text-gray-400">Last 5</span>
          </div>
          <div className="divide-y max-h-[400px] overflow-auto">
            {data?.recentJobs?.length > 0 ? (
              data.recentJobs.map((job, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="max-w-[70%]">
                    <p className="font-medium text-gray-800 truncate">{job.title}</p>
                    <p className="text-sm text-gray-500 truncate">{job.company_name || "Unknown Company"}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    job.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                  } capitalize`}>
                    {job.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-gray-500 text-sm">No recent jobs posted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

