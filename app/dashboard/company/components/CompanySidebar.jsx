"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";

const companyMenu = [
  {
    name: "Dashboard",
    href: "/dashboard/company",
    icon: LayoutDashboard,
  },
  {
    name: "Post a Job",
    href: "/dashboard/company/post-job",
    icon: PlusCircle,
  },
  {
    name: "My Jobs",
    href: "/dashboard/company/my-jobs",
    icon: Briefcase,
  },
  {
    name: "Saved Candidates",
    href: "/dashboard/company/saved-candidates",
    icon: Users,
  },
  {
    name: "Company Profile",
    href: "/dashboard/company/profile",
    icon: Building2,
  },
  {
    name: "Settings",
    href: "/dashboard/company/settings",
    icon: Settings,
  },
];

const CompanySidebar = ({ open }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`
    fixed md:static top-0 left-0
    flex flex-col
    h-full md:h-auto
    bg-black text-white
    w-[260px]
    z-50
    transition-transform duration-300 ease-in-out
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
    >
      {/* Company Profile */}
      <div className="flex flex-col items-center pt-8">
        <Image
          src="https://picsum.photos/200/200?random=2"
          alt="company logo"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <h1 className="mt-3 font-semibold text-lg">Google Inc.</h1>
        <p className="text-sm text-gray-400">Employer</p>
      </div>

      <hr className="my-6 border-gray-800" />

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-4">
        {companyMenu.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors
                ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 w-full px-4">
        <button
          className="
            flex items-center gap-3 w-full px-4 py-3 rounded-lg
            text-gray-400 hover:bg-red-500/10 hover:text-red-400
            transition-colors
          "
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default CompanySidebar;
