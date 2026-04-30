"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/admin/companies");
      const data = await res.json();
      if (res.ok) {
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this company and all their jobs? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCompanies(companies.filter(c => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete company");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the company.");
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
          Companies Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage registered companies and their job postings
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Company
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Industry
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Jobs Posted
              </th>
              <th className="px-6 py-3 text-right font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {companies.length > 0 ? companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                {/* Company */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <Image
                    src={company.logo || "/company-placeholder.svg"}
                    alt={company.name}
                    width={36}
                    height={36}
                    className="rounded-md object-cover border min-w-[36px] min-h-[36px]"
                  />
                  <span className="font-medium text-gray-800">
                    {company.name}
                  </span>
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-gray-500">{company.email}</td>
                
                {/* Industry */}
                <td className="px-6 py-4 text-gray-500">{company.industry || "Not Specified"}</td>

                {/* Jobs */}
                <td className="px-6 py-4 font-medium">{company.jobs_count || 0}</td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleDelete(company.id)}
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
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCompaniesPage;
