"use client";
import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import Link from "next/link";

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      if (res.ok) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

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
                Applied On
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
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  {/* Candidate */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">
                      {app.applicant_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {app.applicant_email}
                    </div>
                  </td>

                  {/* Job */}
                  <td className="px-6 py-4 text-gray-600">{app.job_title}</td>

                  {/* Company */}
                  <td className="px-6 py-4 text-gray-600">
                    {app.company_name || "Unknown"}
                  </td>

                  {/* Applied On */}
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                      ${
                        app.status === "accepted" ||
                        app.status === "shortlisted"
                          ? "bg-green-100 text-green-700"
                          : app.status === "pending" ||
                              app.status === "interview"
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
                      {app.resume_url && (
                        <Link
                          href={app.resume_url}
                          target="_blank"
                          title="View Resume"
                          className="text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <FileText size={18} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplicationsPage;

