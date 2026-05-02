"use client";
import React, { Suspense } from "react";
import Filters from "./Filters";
import { FiX } from "react-icons/fi";

const MobileFilters = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-[#f3f3f3] z-50
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b bg-white">
          <h2 className="heading text-xl">Filters</h2>
          <button onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        {/* Filters */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          <Suspense fallback={null}>
            <Filters isMobile />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default MobileFilters;
