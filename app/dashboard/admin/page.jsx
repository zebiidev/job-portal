"use client";

import { Users, Building2, Briefcase, FileText } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "12,450",
    icon: Users,
  },
  {
    title: "Companies",
    value: "1,280",
    icon: Building2,
  },
  {
    title: "Jobs Posted",
    value: "3,420",
    icon: Briefcase,
  },
  {
    title: "Applications",
    value: "28,900",
    icon: FileText,
  },
];

const recentUsers = [
  { name: "Ahmed Ali", email: "ahmed@mail.com", role: "Job Seeker" },
  { name: "Sarah Khan", email: "sarah@mail.com", role: "Company" },
  { name: "John Smith", email: "john@mail.com", role: "Job Seeker" },
];

const recentJobs = [
  { title: "Frontend Developer", company: "Google" },
  { title: "Backend Engineer", company: "Amazon" },
  { title: "UI/UX Designer", company: "Figma" },
];

const AdminDashboardPage = () => {
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
              className="bg-white rounded-xl p-5 shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {stat.value}
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
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Recent Users</h3>
          </div>
          <div className="divide-y">
            {recentUsers.map((user, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Recent Jobs</h3>
          </div>
          <div className="divide-y">
            {recentJobs.map((job, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
