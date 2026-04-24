"use client";

import { Eye, CheckCircle, XCircle, FileText } from "lucide-react";

const applications = [
  {
    id: 1,
    candidate: "Ahmed Khan",
    job: "Frontend Developer",
    company: "TechNova",
    experience: "3 Years",
    status: "Pending",
  },
  {
    id: 2,
    candidate: "Sarah Ali",
    job: "Backend Engineer",
    company: "NextSoft",
    experience: "5 Years",
    status: "Shortlisted",
  },
  {
    id: 3,
    candidate: "John Doe",
    job: "UI/UX Designer",
    company: "InnoWorks",
    experience: "2 Years",
    status: "Rejected",
  },
];

const AdminApplicationsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Job Applications
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage candidate applications
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Candidate
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Job
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Company
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Experience
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
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                {/* Candidate */}
                <td className="px-6 py-4 font-medium text-gray-800">
                  {app.candidate}
                </td>

                {/* Job */}
                <td className="px-6 py-4 text-gray-600">{app.job}</td>

                {/* Company */}
                <td className="px-6 py-4 text-gray-600">{app.company}</td>

                {/* Experience */}
                <td className="px-6 py-4 text-gray-600">{app.experience}</td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        app.status === "Shortlisted"
                          ? "bg-green-100 text-green-700"
                          : app.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {app.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      title="View Resume"
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <FileText size={18} />
                    </button>

                    <button
                      title="View Application"
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <Eye size={18} />
                    </button>

                    {app.status === "Pending" && (
                      <>
                        <button
                          title="Shortlist"
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

export default AdminApplicationsPage;
