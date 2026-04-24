"use client";

import { useState } from "react";

const stats = [
  { label: "Total Jobs", value: 12 },
  { label: "Active Jobs", value: 5 },
  { label: "Total Applications", value: 235 },
  { label: "Expiring Soon", value: 2 },
];

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    location: "New York, NY",
    type: "Full-time",
    status: "active",
    applicants: 32,
    posted: "5 days ago",
  },
  {
    id: 2,
    title: "Marketing Specialist",
    location: "San Francisco, CA",
    type: "Contract",
    status: "draft",
    applicants: 0,
    posted: "2 days ago",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    location: "Remote",
    type: "Full-time",
    status: "closed",
    applicants: 18,
    posted: "Closed on Apr 10",
  },
];

const statusStyles = {
  active: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  closed: "bg-red-100 text-red-700",
  expired: "bg-gray-200 text-gray-700",
};

export default function MyJobsPanel() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">My Jobs</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg p-4 border shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white p-4 rounded-lg border flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select className="w-full md:w-1/4 border rounded-md px-3 py-2">
          <option>Status: All</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>

        <select className="w-full md:w-1/4 border rounded-md px-3 py-2">
          <option>Sort: Newest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      {/* Job List */}
      <div className="mt-6 space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            {/* Left */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {job.title}
              </h2>
              <p className="text-sm text-gray-500">
                {job.location} · {job.type}
              </p>
            </div>

            {/* Middle */}
            <div className="flex items-center gap-4 text-sm">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusStyles[job.status]
                }`}
              >
                {job.status}
              </span>
              <span className="text-gray-500">{job.applicants} applicants</span>
              <span className="text-gray-400">{job.posted}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
                View
              </button>
              <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
                Edit
              </button>
              <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
                Applications
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
