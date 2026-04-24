"use client";

import { Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Remote",
    type: "Full-time",
    applications: 24,
    status: "Pending",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "NextSoft",
    location: "Berlin, Germany",
    type: "Full-time",
    applications: 12,
    status: "Approved",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "InnoWorks",
    location: "London, UK",
    type: "Contract",
    applications: 4,
    status: "Rejected",
  },
];

const AdminJobsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Jobs Management
        </h1>
        <p className="text-gray-500 mt-1">
          Review, approve, or reject job postings
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Job
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Company
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Location
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Applications
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-right font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                {/* Job */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{job.title}</div>
                  <div className="text-xs text-gray-500">{job.type}</div>
                </td>

                {/* Company */}
                <td className="px-6 py-4 text-gray-600">{job.company}</td>

                {/* Location */}
                <td className="px-6 py-4 text-gray-600">{job.location}</td>

                {/* Applications */}
                <td className="px-6 py-4 font-medium">{job.applications}</td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        job.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : job.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {job.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      title="View Job"
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <Eye size={18} />
                    </button>

                    {job.status === "Pending" && (
                      <>
                        <button
                          title="Approve"
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle size={18} />
                        </button>

                        <button
                          title="Reject"
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}

                    <button
                      title="Delete"
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobsPage;
