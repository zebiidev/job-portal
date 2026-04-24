"use client";

import { Eye, CheckCircle, XCircle, Trash2, AlertTriangle } from "lucide-react";

const reports = [
  {
    id: 1,
    type: "Job",
    reportedItem: "Frontend Developer Job",
    reportedBy: "Ahmed Khan",
    reason: "Fake job description",
    status: "Pending",
  },
  {
    id: 2,
    type: "Company",
    reportedItem: "TechNova Ltd",
    reportedBy: "Sarah Ali",
    reason: "Scam company",
    status: "Resolved",
  },
  {
    id: 3,
    type: "User",
    reportedItem: "john_doe",
    reportedBy: "Admin",
    reason: "Spam activity",
    status: "Rejected",
  },
];

const AdminReportsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Reports & Flags
        </h1>
        <p className="text-gray-500 mt-1">
          Review reported jobs, companies, and users
        </p>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Type
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Reported Item
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Reason
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Reported By
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
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                {/* Type */}
                <td className="px-6 py-4 flex items-center gap-2 font-medium">
                  <AlertTriangle size={16} className="text-yellow-500" />
                  {report.type}
                </td>

                {/* Item */}
                <td className="px-6 py-4 text-gray-700">
                  {report.reportedItem}
                </td>

                {/* Reason */}
                <td className="px-6 py-4 text-gray-600">{report.reason}</td>

                {/* Reporter */}
                <td className="px-6 py-4 text-gray-600">{report.reportedBy}</td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        report.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : report.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {report.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      title="View Details"
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <Eye size={18} />
                    </button>

                    {report.status === "Pending" && (
                      <>
                        <button
                          title="Resolve"
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
                      title="Delete Report"
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

export default AdminReportsPage;
