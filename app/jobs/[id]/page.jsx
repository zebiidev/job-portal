import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Since it's a server component in Next.js 13+, we can fetch data directly
const getJobData = async (id) => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/jobs/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching job details:", error);
    return null;
  }
};

const formatSalary = (min, max, currency, period) => {
  if (!min && !max) return "Salary not disclosed";
  const cur = currency || "PKR";
  const per = period || "year";
  if (min && max) {
    return `${cur} ${min.toLocaleString()} - ${max.toLocaleString()}/${per}`;
  }
  return `${cur} ${min?.toLocaleString() || max?.toLocaleString()}/${per}`;
};

const JobDetailsPage = async ({ params }) => {
  const { id } = await params;
  const data = await getJobData(id);

  if (!data || !data.job) {
    notFound();
  }

  const { job } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-gradient-to-br from-white via-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white rounded-2xl p-3 shadow-sm border">
                <Image
                  src={job.company_logo || "/company-placeholder.svg"}
                  alt={job.company_name}
                  width={56}
                  height={56}
                  className="rounded-xl object-contain min-w-[56px] min-h-[56px]"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {job.company_name}
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  {job.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {job.location} · {job.work_type} · {job.emp_type}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-white border text-gray-700 capitalize">
                    {job.job_level} level
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-white border text-gray-700">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  {job.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/jobs/${job.id}/apply`}
                className="px-6 py-3 rounded-xl bg-black text-white text-sm font-medium text-center hover:bg-gray-900 transition shadow-lg shadow-black/10"
              >
                Apply Now
              </Link>
              <Link
                href="/jobs"
                className="px-6 py-3 rounded-xl border border-gray-300 text-sm font-medium text-center hover:bg-white transition"
              >
                Back to Jobs
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Salary Range
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {formatSalary(job.min_salary, job.max_salary, job.currency, job.salary_period)}
              </p>
            </div>
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Applications
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {job.applicationCount} Applicants
              </p>
            </div>
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Experience
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {job.experience}+ Years
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Description
            </h2>
            <div className="text-sm text-gray-600 mt-3 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </section>

          {/* If there's structured data for responsibilities/requirements in the DB, we could add them here. 
              For now, we'll assume they are part of the description or can be parsed. */}
        </div>

        <div className="space-y-6">
          <aside className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">
              Company Snapshot
            </h3>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {job.about_company || "No company description provided."}
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Industry:</span>{" "}
                {job.industry || "Not specified"}
              </p>
              <p>
                <span className="font-medium text-gray-900">Company size:</span>{" "}
                {job.company_size || "Not specified"}
              </p>
              {job.company_website && (
                <p>
                  <span className="font-medium text-gray-900">Website:</span>{" "}
                  <a href={job.company_website} target="_blank" className="text-blue-600 hover:underline">
                    Visit Website
                  </a>
                </p>
              )}
            </div>
          </aside>

          <aside className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">
              Job Details
            </h3>
            <div className="mt-3 space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Work mode:</span>{" "}
                {job.work_type}
              </p>
              <p>
                <span className="font-medium text-gray-900">Employment:</span>{" "}
                {job.emp_type}
              </p>
              <p>
                <span className="font-medium text-gray-900">Experience:</span>{" "}
                {job.job_level} level
              </p>
              <p>
                <span className="font-medium text-gray-900">Education:</span>{" "}
                {job.education || "Not specified"}
              </p>
            </div>
            <Link
              href={`/jobs/${job.id}/apply`}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-black text-white text-sm font-medium py-3 hover:bg-gray-900 transition shadow-lg"
            >
              Apply for this role
            </Link>
          </aside>

          <aside className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-semibold text-white">Hiring Timeline</h3>
            <div className="mt-3 text-sm text-gray-300 space-y-2">
              {job.expiry_date ? (
                <p>Applications close on {new Date(job.expiry_date).toLocaleDateString()}.</p>
              ) : (
                <p>Applications are currently open.</p>
              )}
              <p>Shortlisted candidates hear back within 5 business days.</p>
              <p>Virtual interviews scheduled the following week.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

