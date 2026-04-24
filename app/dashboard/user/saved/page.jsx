"use client";

import { useState } from "react";
import Image from "next/image";

const savedJobs = [
  {
    id: 1,
    title: "Project Manager",
    company: "BuildWorks",
    location: "San Francisco, USA",
    logo: "/companies/company-placeholder.svg",
    salary: "Rs 15,00,000 – Rs 25,00,000",
    savedAt: "3 days ago",
  },
  {
    id: 2,
    title: "UX Designer",
    company: "Creative Studio",
    location: "Remote",
    logo: "/companies/company-placeholder.svg",
    salary: "Rs 12,00,000 – Rs 16,00,000",
    savedAt: "5 days ago",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "WebSolutions",
    location: "New York, USA",
    logo: "/companies/company-placeholder.svg",
    salary: "Rs 10,00,000 – Rs 15,00,000",
    savedAt: "1 week ago",
  },
  {
    id: 4,
    title: "Marketing Specialist",
    company: "Creative Ltd",
    location: "Bangalore, India",
    logo: "/companies/company-placeholder.svg",
    salary: "Rs 8,00,000 – Rs 13,00,000",
    savedAt: "2 weeks ago",
  },
];

const ITEMS_PER_PAGE = 3;

export default function SavedJobsRightPanel() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(savedJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJobs = savedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-black">Saved Jobs</h2>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search saved jobs..."
              className="w-full border rounded-lg pl-4 pr-10 py-2 text-sm"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Saved Jobs List */}
        <div className="space-y-4">
          {currentJobs.map((job) => (
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
                    📍 {job.location} · Saved {job.savedAt}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col md:items-end gap-3">
                <p className="text-sm font-medium text-gray-700">
                  {job.salary}
                </p>

                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    Apply Now
                  </button>

                  <button className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 text-sm">
          <p className="text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, savedJobs.length)} of{" "}
            {savedJobs.length} saved jobs
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
