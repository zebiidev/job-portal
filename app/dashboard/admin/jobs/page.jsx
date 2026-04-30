"use client";
import React, { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    
    try {
      const res = await fetch(`/api/admin/jobs?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the job.");
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
          Jobs Management
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage job postings
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
            {jobs.length > 0 ? jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                {/* Job */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800 truncate max-w-[200px]">{job.title}</div>
                  <div className="text-xs text-gray-500 capitalize">{job.emp_type}</div>
                </td>

                {/* Company */}
                <td className="px-6 py-4 text-gray-600 truncate max-w-[150px]">{job.company_name || "Unknown"}</td>

                {/* Location */}
                <td className="px-6 py-4 text-gray-600 truncate max-w-[150px]">{job.location}</td>

                {/* Applications */}
                <td className="px-6 py-4 font-medium">{job.applicant_count || 0}</td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                      ${
                        job.status === "active"
                          ? "bg-green-100 text-green-700"
                          : job.status === "closed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {job.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/jobs/${job.id}`}
                      target="_blank"
                      title="View Job"
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <Eye size={18} />
                    </Link>

                    <button
                      onClick={() => handleDelete(job.id)}
                      title="Delete"
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobsPage;
