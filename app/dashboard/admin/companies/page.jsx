"use client";

import Image from "next/image";
import { Eye, CheckCircle, Ban, Trash2 } from "lucide-react";

const companies = [
  {
    id: 1,
    name: "TechNova",
    email: "hr@technova.com",
    logo: "/company-placeholder.svg",
    jobs: 12,
    status: "Approved",
  },
  {
    id: 2,
    name: "NextSoft",
    email: "contact@nextsoft.io",
    logo: "/company-placeholder.svg",
    jobs: 5,
    status: "Pending",
  },
  {
    id: 3,
    name: "InnoWorks",
    email: "hr@innoworks.com",
    logo: "/company-placeholder.svg",
    jobs: 0,
    status: "Blocked",
  },
];

const AdminCompaniesPage = () => {
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
                Jobs
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
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                {/* Company */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={36}
                    height={36}
                    className="rounded-md object-cover border"
                  />
                  <span className="font-medium text-gray-800">
                    {company.name}
                  </span>
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-gray-500">{company.email}</td>

                {/* Jobs */}
                <td className="px-6 py-4 font-medium">{company.jobs}</td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        company.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : company.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {company.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      title="View"
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <Eye size={18} />
                    </button>

                    {company.status === "Pending" && (
                      <button
                        title="Approve"
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}

                    <button
                      title="Block"
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <Ban size={18} />
                    </button>

                    <button
                      title="Delete"
                      className="text-red-500 hover:text-red-700"
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

export default AdminCompaniesPage;
