import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById } from "@/lib/jobsData";

const formatSalary = (salary) => {
  if (!salary) return "Salary not disclosed";
  if (typeof salary === "number") return `Rs ${salary.toLocaleString()}`;
  if (salary.min && salary.max) {
    const period = salary.period ? `/${salary.period}` : "";
    return `Rs ${salary.min.toLocaleString()} - Rs ${salary.max.toLocaleString()}${period}`;
  }
  return "Salary not disclosed";
};

const JobApplyPage = async ({ params }) => {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-gradient-to-br from-white via-slate-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white rounded-2xl p-3 shadow-sm border">
                <Image
                  src={job.logo}
                  alt={job.company}
                  width={56}
                  height={56}
                  className="rounded-xl object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Applying to {job.company}
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  {job.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {job.location} · {job.workMode} · {job.employmentType}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/jobs/${job.id}`}
                className="px-6 py-3 rounded-xl border border-gray-300 text-sm font-medium text-center hover:bg-white transition"
              >
                View Details
              </Link>
              <Link
                href="/jobs"
                className="px-6 py-3 rounded-xl bg-black text-white text-sm font-medium text-center hover:bg-gray-900 transition"
              >
                Explore More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Candidate Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Provide accurate details so the hiring team can reach you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="+91 00000 00000"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Current location
              </label>
              <input
                type="text"
                placeholder="City, Country"
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Years of experience
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Expected salary
                </label>
                <input
                  type="text"
                  placeholder="Rs 0"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Portfolio or LinkedIn
              </label>
              <input
                type="url"
                placeholder="https://"
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Resume</label>
              <div className="mt-2 border-2 border-dashed rounded-xl p-4 text-sm text-gray-500">
                Upload PDF or DOCX (max 10MB)
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Cover letter
              </label>
              <textarea
                rows="5"
                placeholder="Tell us why you are a great fit for this role"
                className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
              <p className="text-xs text-gray-500">
                By submitting, you agree to our hiring and privacy terms.
              </p>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <aside className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">
              Role Summary
            </h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Salary:</span>{" "}
                {formatSalary(job.salary)}
              </p>
              <p>
                <span className="font-medium text-gray-900">Openings:</span>{" "}
                {job.openings}
              </p>
              <p>
                <span className="font-medium text-gray-900">Apply by:</span>{" "}
                {job.applyBy}
              </p>
              <p>
                <span className="font-medium text-gray-900">Recruiter:</span>{" "}
                {job.recruiterEmail}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </aside>

          <aside className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">
              Application Checklist
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>Updated resume in PDF</li>
              <li>Portfolio or project links</li>
              <li>Clear availability details</li>
              <li>Relevant skills highlighted</li>
            </ul>
          </aside>

          <aside className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl p-6">
            <h3 className="text-base font-semibold">What happens next</h3>
            <p className="mt-3 text-sm text-emerald-100">
              Our hiring team will review your profile and reach out within 5
              business days if you are shortlisted.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobApplyPage;
