"use client";
import React, { Suspense, useState } from "react";
import { FiFilter } from "react-icons/fi";
import JobsListings from "./components/JobsListings";
import Filters from "./components/Filters";
import MobileFilters from "./components/MobileFilters";

export const dynamic = "force-dynamic";

const JobsPage = () => {
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Filter Button */}
      <div className="md:hidden px-4 py-3 bg-white border-b">
        <button
          onClick={() => setOpenFilters(true)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      {/* Mobile Drawer */}
      <Suspense fallback={null}>
        <MobileFilters
          open={openFilters}
          onClose={() => setOpenFilters(false)}
          onFilterChange={handleFilterChange}
        />
      </Suspense>

      {/* Page Layout */}
      <div className="flex">
        <Suspense fallback={null}>
          <Filters onFilterChange={handleFilterChange} />
        </Suspense>

        {/* Job Listings */}
        <div className="flex-1 p-4">
          <JobsListings filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
