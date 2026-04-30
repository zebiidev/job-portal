"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const formatSalary = (min, max, currency, period) => {
  if (!min && !max) return "Salary not disclosed";
  const cur = currency || "PKR";
  const per = period || "year";
  if (min && max) {
    return `${cur} ${min.toLocaleString()} - ${max.toLocaleString()}/${per}`;
  }
  return `${cur} ${min?.toLocaleString() || max?.toLocaleString()}/${per}`;
};

export default function JobApplyPage({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    // Unwrap params using React.use() equivalent pattern for Next 13+ if needed, or just access it directly in useEffect.
    // In newer Next.js versions, params might be a promise.
    const fetchJob = async () => {
      try {
        const resolvedParams = await params;
        setJobId(resolvedParams.id);
        const res = await fetch(`/api/jobs/${resolvedParams.id}`);
        if (!res.ok) {
          setError("Job not found");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setJob(data.job);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("You must be logged in to apply!");
      router.push("/login");
      return;
    }
    
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/user");
        }, 2000);
      }
    } catch (err) {
      setError("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
          <Link href="/jobs" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-gradient-to-br from-white via-slate-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white rounded-2xl p-3 shadow-sm border">
                <Image
                  src={job.company_logo || "/company-placeholder.svg"}
                  alt={job.company_name || "Company"}
                  width={56}
                  height={56}
                  className="rounded-xl object-contain min-w-[56px] min-h-[56px]"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Applying to {job.company_name}
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  {job.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {job.location} · {job.work_type} · {job.emp_type}
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {success ? (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
              <p className="text-emerald-600">You will be redirected to your dashboard shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Application Form
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Provide your details below to apply for this role.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Resume Link (Portfolio, Google Drive, etc.)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please provide a direct link to your resume or portfolio.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Cover letter
                </label>
                <textarea
                  rows="5"
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you are a great fit for this role"
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <p className="text-xs text-gray-500">
                  By submitting, you agree to our hiring and privacy terms.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <aside className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900">
              Role Summary
            </h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Salary:</span>{" "}
                {formatSalary(job.min_salary, job.max_salary, job.currency, job.salary_period)}
              </p>
              <p>
                <span className="font-medium text-gray-900">Apply by:</span>{" "}
                {job.expiry_date ? new Date(job.expiry_date).toLocaleDateString() : "Open until filled"}
              </p>
            </div>
            {job.tags && job.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
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
}
