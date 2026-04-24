"use client";

import Image from "next/image";
import Link from "next/link";
import { RiMenuFoldLine } from "react-icons/ri";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [openNav, setOpenNav] = useState(false);

  const user = session?.user;
  const isLoggedIn = status === "authenticated";

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "company") return "/dashboard/company";
    return "/dashboard/user";
  };

  const dashboardPath = getDashboardPath();

  const jobSeekerLinks = [
    { path: dashboardPath, name: "Dashboard" },
    { path: "/jobs", name: "Jobs" },
    { path: "/ai-resume", name: "AI Resume" },
    { path: "/interview-prep", name: "Interview Prep" },
  ];

  const companyLinks = [
    { path: dashboardPath, name: "Dashboard" },
    { path: "/dashboard/company/post-job", name: "Post Job" },
    { path: "/dashboard/company/my-jobs", name: "My Jobs" },
    { path: "/jobs", name: "Browse Jobs" },
  ];

  const adminLinks = [
    { path: dashboardPath, name: "Admin Panel" },
    { path: "/dashboard/admin/users", name: "Users" },
    { path: "/dashboard/admin/jobs", name: "Jobs" },
    { path: "/dashboard/admin/applications", name: "Applications" },
  ];

  const publicLinks = [
    { path: "/jobs", name: "Jobs" },
    { path: "/ai-resume", name: "AI Resume" },
    { path: "/interview-prep", name: "Interview Prep" },
  ];

  const getNavLinks = () => {
    if (!isLoggedIn) return publicLinks;
    if (user?.role === "company") return companyLinks;
    if (user?.role === "admin") return adminLinks;
    return jobSeekerLinks;
  };

  const navLinks = getNavLinks();

  const toggleNav = () => setOpenNav(!openNav);

  return (
    <>
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-[72px] flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                width={150}
                height={40}
                alt="logo"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.path}
                  className="group flex flex-col items-start text-sm font-medium text-gray-700 hover:text-black transition"
                >
                  {item.name}
                  <span className="mt-1 h-[0.7px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    href={dashboardPath}
                    className="text-sm font-medium text-gray-700 hover:text-black"
                  >
                    {user?.name || "Account"}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm font-semibold text-white bg-black px-4 py-2 rounded-md hover:bg-gray-900 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-white bg-black px-4 py-2 rounded-md hover:bg-gray-900 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium text-gray-700 hover:text-black border border-gray-300 px-4 py-2 rounded-md transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={toggleNav}
              className="md:hidden text-3xl text-black"
            >
              <RiMenuFoldLine />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {openNav && (
        <div onClick={toggleNav} className="fixed inset-0 bg-black/40 z-40" />
      )}

      {/* Mobile Nav */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-[70vw] max-w-sm bg-white border-l transition-transform duration-500 ${
          openNav ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <MobileNav toggleNav={toggleNav} />
      </div>
    </>
  );
};

export default Navbar;
