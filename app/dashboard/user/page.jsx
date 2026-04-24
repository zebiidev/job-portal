"use client";
import Link from "next/link";
import React from "react";

const stats = [
  { label: "Applications", value: 12, icon: "📄" },
  { label: "Interviews", value: 2, icon: "📅" },
  { label: "Saved Jobs", value: 5, icon: "❤️" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen rounded-md bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, Ahmed!s
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

          {/* Profile Completion */}
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile</p>
              <p className="text-xl font-bold">80% Complete</p>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-green-500 flex items-center justify-center text-sm font-semibold">
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
                  <tr className="border-t">
                    <td className="py-2">Software Engineer</td>
                    <td>TechCorp</td>
                    <td>2 days ago</td>
                    <td>
                      <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                        Under Review
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">Marketing Specialist</td>
                    <td>Creative Ltd</td>
                    <td>1 week ago</td>
                    <td>
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                        Interview
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">Data Analyst</td>
                    <td>DataWorks</td>
                    <td>2 weeks ago</td>
                    <td>
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                        Rejected
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button className="text-blue-600 text-sm mt-3 hover:underline">
              View All →
            </button>
          </div>

          {/* Saved Jobs */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-4">Saved Jobs</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Project Manager</p>
                  <p className="text-sm text-gray-500">BuildWorks</p>
                </div>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                  Apply Now
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Graphic Designer</p>
                  <p className="text-sm text-gray-500">DesignHub</p>
                </div>
                <button className="px-3 py-1 text-sm border rounded">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Interview */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Upcoming Interview</h2>
            <p className="text-sm text-gray-600">
              TechCorp – Software Engineer
            </p>
            <p className="text-sm text-gray-500">Monday, March 25 | 10:00 AM</p>
          </div>

          {/* Complete Profile */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold mb-1">Complete Your Profile</h2>
              <p className="text-sm text-gray-500">
                Update your resume & details
              </p>
            </div>
            <Link href="/dashboard/user/profile">
              {" "}
              <button className="bg-blue-600 text-white md:px-4 md:py-2 rounded">
                Complete Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
