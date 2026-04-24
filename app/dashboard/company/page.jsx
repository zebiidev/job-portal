"use client";

export default function CompanyDashboardRightPanel() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-black">
            Welcome back, Google Inc 👋
          </h2>
          <p className="text-gray-500 text-sm">
            Here’s what’s happening with your jobs today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Jobs" value="12" />
          <StatCard title="Active Jobs" value="8" />
          <StatCard title="Applicants" value="148" />
          <StatCard title="New Today" value="6" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Jobs */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-4 md:overflow-x-hidden overflow-x-auto">
            <h3 className="font-semibold text-lg mb-4">Recent Job Posts</h3>

            <table className="w-full text-sm min-w-[600px]">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-2">Job Title</th>
                  <th className="text-left py-2">Applicants</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <JobRow
                  title="Frontend Developer"
                  applicants="32"
                  status="Open"
                  posted="2 days ago"
                />
                <JobRow
                  title="Backend Engineer"
                  applicants="18"
                  status="Open"
                  posted="5 days ago"
                />
                <JobRow
                  title="UI/UX Designer"
                  applicants="9"
                  status="Closed"
                  posted="1 week ago"
                />
              </tbody>
            </table>

            <button className="mt-4 text-sm text-blue-600 hover:underline">
              View all jobs →
            </button>
          </div>

          {/* Latest Applicants */}
          <div className="bg-white rounded-xl border p-4 space-y-4">
            <h3 className="font-semibold text-lg">Latest Applicants</h3>

            <Applicant
              name="Ahmed Khan"
              role="Frontend Developer"
              status="New"
            />
            <Applicant
              name="Sara Ali"
              role="Backend Engineer"
              status="Reviewed"
            />
            <Applicant
              name="John Smith"
              role="UI/UX Designer"
              status="Shortlisted"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard
            title="Post a New Job"
            description="Create and publish a new job listing"
            btnText="Post Job"
          />
          <ActionCard
            title="Complete Company Profile"
            description="Add logo, description & details"
            btnText="Update Profile"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------ Small Components ------------------ */

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl border p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-semibold mt-1">{value}</h3>
  </div>
);

const JobRow = ({ title, applicants, status, posted }) => (
  <tr>
    <td className="py-3 font-medium">{title}</td>
    <td>{applicants}</td>
    <td>
      <span
        className={`px-2 py-1  rounded-full text-xs font-medium ${
          status === "Open"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {status}
      </span>
    </td>
    <td className="text-gray-500">{posted}</td>
  </tr>
);

const Applicant = ({ name, role, status }) => (
  <div className="flex justify-between items-center border rounded-lg p-3">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-xs text-gray-500">{role}</p>
    </div>
    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
      {status}
    </span>
  </div>
);

const ActionCard = ({ title, description, btnText }) => (
  <div className="bg-white rounded-xl border p-4 flex justify-between items-center">
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
      {btnText}
    </button>
  </div>
);
