"use client";

import React, { useState } from "react";
import { IoMenuSharp } from "react-icons/io5";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar open={open} />

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="md:hidden relative p-4 bg-white shadow z-20">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl absolute right-3 top-4 font-medium"
          >
            <IoMenuSharp />
          </button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
