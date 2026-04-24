"use client";

import Image from "next/image";
import Link from "next/link";

const JobCard = ({ job }) => {
  const hasSalaryRange = job.salary?.min && job.salary?.max;
  const isSalaryNumber = typeof job.salary === "number";
  const formattedSalary = isSalaryNumber
    ? `Rs ${job.salary.toLocaleString()}`
    : hasSalaryRange
      ? `Rs ${job.salary.min.toLocaleString()} - Rs ${job.salary.max.toLocaleString()}`
      : null;

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white  transition-all">
      {/* Company Info */}
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={job.logo}
          alt={job.company}
          width={40}
          height={40}
          className="rounded-md object-contain"
        />
        <div>
          <p className="text-sm font-medium">{job.company}</p>
          <p className="text-xs text-gray-500">{job.location}</p>
        </div>
      </div>

      {/* Job Title */}
      <h3 className="text-lg font-semibold text-black mb-3">{job.title}</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.type && (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {job.type.replace("-", " ")}
          </span>
        )}

        {job.experience && (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
            {job.experience} level
          </span>
        )}

        {job.category && (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
            {job.category}
          </span>
        )}
      </div>

      {/* Salary & Date */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm font-medium text-black">
          {formattedSalary ? (
            <span className="text-sm text-gray-600">{formattedSalary}</span>
          ) : (
            <span className="text-sm text-gray-400">Salary not disclosed</span>
          )}
        </p>
        <p className="text-xs text-gray-500">{job.postedAt}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/jobs/${job.id}/apply`}
          className="flex-1 cursor-pointer bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition text-center"
        >
          Apply Now
        </Link>

        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 cursor-pointer border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
