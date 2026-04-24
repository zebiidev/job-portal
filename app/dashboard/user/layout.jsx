"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { IoMenuSharp } from "react-icons/io5";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar open={open} />

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-20 bg-white shadow p-4">
          <button
            onClick={() => setOpen(true)}
            className="absolute right-4 top-4 text-2xl"
          >
            <IoMenuSharp />
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
