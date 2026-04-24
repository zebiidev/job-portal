"use client";
import React, { useState } from "react";
import { FiFilter } from "react-icons/fi";
import JobsListings from "./components/JobsListings";
import Filters from "./components/Filters";
import MobileFilters from "./components/MobileFilters";

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
      <MobileFilters open={openFilters} onClose={() => setOpenFilters(false)} onFilterChange={handleFilterChange} />

      {/* Page Layout */}
      <div className="flex">
        <Filters onFilterChange={handleFilterChange} />

        {/* Job Listings */}
        <div className="flex-1 p-4">
          <JobsListings filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
