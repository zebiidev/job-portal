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

const JobDetailsPage = async ({ params }) => {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-gradient-to-br from-white via-slate-50 to-blue-50">
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
                  {job.company}
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  {job.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {job.location} · {job.workMode} · {job.employmentType}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-white border text-gray-700 capitalize">
                    {job.experience} level
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-white border text-gray-700 capitalize">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-white border text-gray-700">
                    Posted {job.postedAt}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/jobs/${job.id}/apply`}
                className="px-6 py-3 rounded-xl bg-black text-white text-sm font-medium text-center hover:bg-gray-900 transition"
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
                {formatSalary(job.salary)}
              </p>
            </div>
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Openings
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {job.openings}
              </p>
            </div>
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Apply By
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {job.applyBy}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              About the Role
            </h2>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {job.description}
            </p>
          </section>

          <section className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Responsibilities
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-black"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Requirements
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {job.requirements.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-black"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {job.niceToHave?.length ? (
              <div className="mt-5">
                <p className="text-sm font-medium text-gray-900">
                  Nice to have
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  {job.niceToHave.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-gray-400"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {job.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="border rounded-xl p-3 text-sm text-gray-700 bg-slate-50"
                >
                  {benefit}
                </div>
              ))}
            </div>
            {job.perks?.length ? (
              <div className="mt-5">
                <p className="text-sm font-medium text-gray-900">Perks</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.perks.map((perk) => (
                    <span
                      key={perk}
                      className="px-3 py-1 rounded-full text-xs bg-white border text-gray-700"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>

        <div className="space-y-6">
          <aside className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">
              Company Snapshot
            </h3>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {job.aboutCompany}
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Industry:</span>{" "}
                {job.industry}
              </p>
              <p>
                <span className="font-medium text-gray-900">Team:</span>{" "}
                {job.department}
              </p>
              <p>
                <span className="font-medium text-gray-900">Company size:</span>{" "}
                {job.companySize}
              </p>
            </div>
          </aside>

          <aside className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">
              Job Details
            </h3>
            <div className="mt-3 space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Work mode:</span>{" "}
                {job.workMode}
              </p>
              <p>
                <span className="font-medium text-gray-900">Employment:</span>{" "}
                {job.employmentType}
              </p>
              <p>
                <span className="font-medium text-gray-900">Experience:</span>{" "}
                {job.experience} level
              </p>
              <p>
                <span className="font-medium text-gray-900">Recruiter:</span>{" "}
                {job.recruiterEmail}
              </p>
            </div>
            <Link
              href={`/jobs/${job.id}/apply`}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-black text-white text-sm font-medium py-3 hover:bg-gray-900 transition"
            >
              Apply for this role
            </Link>
          </aside>

          <aside className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-6">
            <h3 className="text-base font-semibold">Hiring Timeline</h3>
            <div className="mt-3 text-sm text-gray-200 space-y-2">
              <p>Applications close on {job.applyBy}.</p>
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
