"use client";

import { useState } from "react";
import Image from "next/image";

const applications = [
  {
    id: 1,
    title: "Software Engineer",
    company: "TechCorp",
    location: "Hyderabad, India",
    logo: "/companies/company-placeholder.svg",
    salary: "Rs 10,00,000 – Rs 15,00,000",
    status: "Under Review",
    appliedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Marketing Specialist",
    company: "Creative Ltd",
    location: "Bangalore, India",
    logo: "/companies/company-placeholder.svg",
    salary: "Rs 10,00,000 – Rs 15,00,000",
    status: "Interview",
    appliedAt: "1 week ago",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "DataWorks",
    location: "Bangalore, India",
    logo: "/companies/company-placeholder.svg",
    salary: "Rs 10,00,000 – Rs 15,00,000",
    status: "Rejected",
    appliedAt: "2 weeks ago",
  },
  {
    id: 4,
    title: "Graphic Designer",
    company: "DesignHub",
    location: "Chennai, India",
    logo: "/companies/company-placeholder.svg",
    salary: "Rs 10,00,000 – Rs 15,00,000",
    status: "Under Review",
    appliedAt: "3 days ago",
  },
];

const ITEMS_PER_PAGE = 3;

export default function ApplicationsRightPanel() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = applications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>All Applications</option>
              <option>Under Review</option>
              <option>Interview</option>
              <option>Rejected</option>
            </select>

            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>Date Applied</option>
              <option>Last 7 days</option>
              <option>Last 14 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full border rounded-lg pl-4 pr-10 py-2 text-sm"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {currentItems.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Left */}
              <div className="flex gap-4">
                <Image
                  src={job.logo || "/companies/company-placeholder.svg"}
                  alt={job.company}
                  width={48}
                  height={48}
                  className="rounded-md object-contain"
                />

                <div>
                  <h3 className="font-semibold text-black">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                  <p className="text-xs text-gray-400">
                    📍 {job.location} · {job.appliedAt}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col md:items-end gap-2">
                <p className="text-sm font-medium text-gray-700">
                  {job.salary}
                </p>

                <span
                  className={`px-3 py-1 text-xs rounded-full w-fit ${
                    job.status === "Under Review"
                      ? "bg-yellow-100 text-yellow-700"
                      : job.status === "Interview"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 text-sm">
          <p className="text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, applications.length)} of{" "}
            {applications.length} applications
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
