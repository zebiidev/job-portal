"use client";

import JobCard from "@/components/JobCard";

const LatestJobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Cloud Engineer",
      company: "Google",
      location: "Hyderabad, India",
      logo: "/companies/company-placeholder.svg",
      type: "full-time",
      experience: "intermediate",
      category: "engineering",
      salary: {
        min: 1200000,
        max: 2000000,
      },
      postedAt: "2 days ago",
    },
    {
      id: 2,
      title: "Network Security Engineer",
      company: "Google",
      location: "Bangalore, India",
      logo: "/companies/company-placeholder.svg",
      type: "full-time",
      experience: "senior",
      category: "security",
      salary: {
        min: 1800000,
        max: 2800000,
      },
      postedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Software Tester",
      company: "Google",
      location: "Chennai, India",
      logo: "/companies/company-placeholder.svg",
      type: "contract",
      experience: "intermediate",
      category: "qa",
      salary: {
        min: 800000,
        max: 1200000,
      },
      postedAt: "5 days ago",
    },
    {
      id: 4,
      title: "Graphic Designer",
      company: "Google",
      location: "Chennai, India",
      logo: "/companies/company-placeholder.svg",
      type: "full-time",
      experience: "intermediate",
      category: "design",
      salary: null, // salary not disclosed
      postedAt: "3 days ago",
    },
    {
      id: 5,
      title: "Content Marketing Manager",
      company: "Google",
      location: "Mumbai, India",
      logo: "/companies/company-placeholder.svg",
      type: "full-time",
      experience: "senior",
      category: "marketing",
      salary: {
        min: 1500000,
        max: 2500000,
      },
      postedAt: "1 week ago",
    },
    {
      id: 6,
      title: "Human Resources Specialist",
      company: "Google",
      location: "Washington, USA",
      logo: "/companies/company-placeholder.svg",
      type: "full-time",
      experience: "intermediate",
      category: "hr",
      salary: {
        min: 900000,
        max: 1400000,
      },
      postedAt: "4 days ago",
    },
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-2">Latest Jobs</h2>
          <p className="text-gray-600">
            Get your desired job from top companies
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
