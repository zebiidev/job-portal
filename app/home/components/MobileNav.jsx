"use client";

import Link from "next/link";
import { useState } from "react";
import { FiX } from "react-icons/fi";

const MobileNav = ({ toggleNav }) => {
  // TEMP: later replace with auth/session role
  const [user] = useState("seeker");

  const jobSeekerLinks = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/jobs", name: "Jobs" },
    { path: "/applications", name: "My Applications" },
    { path: "/ai-resume", name: "AI Resume" },
    { path: "/interview-prep", name: "Interview Prep" },
  ];

  const recruiterLinks = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/post-job", name: "Post Job" },
    { path: "/my-jobs", name: "My Jobs" },
    { path: "/candidates", name: "Candidates" },
    { path: "/analytics", name: "Analytics" },
  ];

  const adminLinks = [
    { path: "/admin", name: "Admin Panel" },
    { path: "/admin/users", name: "Users" },
    { path: "/admin/jobs", name: "Jobs" },
    { path: "/admin/reports", name: "Reports" },
  ];

  const navLinks =
    user === "seeker"
      ? jobSeekerLinks
      : user === "recruiter"
      ? recruiterLinks
      : adminLinks;

  return (
    <div className="h-full w-full px-6 py-8 flex flex-col text-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-semibold">Menu</h2>
        <FiX onClick={toggleNav} className="text-2xl cursor-pointer" />
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-6">
        {navLinks.map((item, idx) => (
          <Link
            key={idx}
            href={item.path}
            className="text-lg font-medium transition-all hover:translate-x-2"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* CTA / Auth */}
      <div className="mt-auto pt-10 border-t border-white/20">
        <Link
          href="/logout"
          className="block text-center bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
