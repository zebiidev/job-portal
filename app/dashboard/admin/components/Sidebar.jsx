"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Building2,
  Briefcase,
  FileText,
  Flag,
  Settings,
  LogOut,
} from "lucide-react";

const adminMenu = [
  { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/admin/users", icon: User },
  { name: "Companies", href: "/dashboard/admin/companies", icon: Building2 },
  { name: "Jobs", href: "/dashboard/admin/jobs", icon: Briefcase },
  {
    name: "Applications",
    href: "/dashboard/admin/applications",
    icon: FileText,
  },
  { name: "Reports", href: "/dashboard/admin/reports", icon: Flag },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

const AdminSidebar = ({ open }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed md:sticky top-0 left-0
        h-screen
        w-[260px]
        bg-black text-white
        flex flex-col
        transition-transform duration-300
        z-40
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Admin Profile */}
      <div className="flex flex-col items-center pt-8">
        <Image
          src="/avatar-placeholder.svg"
          alt="admin"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <h1 className="mt-3 font-semibold text-lg">Admin</h1>
        <p className="text-sm text-gray-400">Platform Manager</p>
      </div>

      <hr className="my-6 border-gray-800" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-4">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

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
      <div className="p-4">
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

export default AdminSidebar;
