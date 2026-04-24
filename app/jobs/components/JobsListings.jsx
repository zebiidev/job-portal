"use client";
import { useEffect, useState } from "react";
import JobCard from "@/components/JobCard";
import { jobs as staticJobs } from "@/lib/jobsData";

const JobsListings = ({ filters = {} }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingStatic, setUsingStatic] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.type) params.set("type", filters.type);
        if (filters.workType) params.set("workType", filters.workType);
        if (filters.level) params.set("level", filters.level);
        if (filters.location) params.set("location", filters.location);

        const res = await fetch(`/api/jobs?${params.toString()}`);
        const data = await res.json();

        if (res.ok && data.jobs && data.jobs.length > 0) {
          // Transform DB jobs to match JobCard expected format
          const transformed = data.jobs.map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company_name || "Unknown Company",
            location: job.location,
            type: job.emp_type,
            experience: job.job_level,
            category: job.work_type,
            salary: {
              min: job.min_salary,
              max: job.max_salary,
              currency: job.currency || "PKR",
              period: job.salary_period || "year",
            },
            postedAt: new Date(job.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            logo: job.company_logo || "/companies/company-placeholder.svg",
            tags: job.tags || [],
          }));
          setJobs(transformed);
          setUsingStatic(false);
        } else {
          // Fallback to static data if DB is empty
          setJobs(staticJobs);
          setUsingStatic(true);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs(staticJobs);
        setUsingStatic(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-2xl p-6 animate-pulse bg-white">
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-md" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-24" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded-lg flex-1" />
              <div className="h-10 bg-gray-200 rounded-lg flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div>
      {usingStatic && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-600">
          Showing sample jobs. Real jobs will appear once posted by companies.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobsListings;
