"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Filters = ({ isMobile = false }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* Constants */
  const MIN = 0;
  const MAX = 300000;

  /* URL → State (INITIAL LOAD) */
  const [salary, setSalary] = useState({
    min: Number(searchParams.get("minSalary")) || 30000,
    max: Number(searchParams.get("maxSalary")) || 200000,
  });

  const [jobTypes, setJobTypes] = useState(
    searchParams.get("type")?.split(",") || [],
  );

  const [experience, setExperience] = useState(
    searchParams.get("experience") || "",
  );

  const [categories, setCategories] = useState(
    searchParams.get("category")?.split(",") || [],
  );

  /* 🔁 UPDATE URL WHEN FILTERS CHANGE */
  useEffect(() => {
    const params = new URLSearchParams();

    if (jobTypes.length) params.set("type", jobTypes.join(","));
    if (experience) params.set("experience", experience);
    if (categories.length) params.set("category", categories.join(","));

    params.set("minSalary", salary.min);
    params.set("maxSalary", salary.max);

    router.replace(`/jobs?${params.toString()}`, { scroll: false });
  }, [jobTypes, experience, categories, salary, router]);

  /* Helpers */
  const toggleArrayValue = (value, setter, state) => {
    setter(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value],
    );
  };

  /* Salary Handlers */
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), salary.max - 10000);
    setSalary((prev) => ({ ...prev, min: value }));
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), salary.min + 10000);
    setSalary((prev) => ({ ...prev, max: value }));
  };

  /* Data */
  const jobTypeOptions = [
    "full-time",
    "part-time",
    "internship",
    "contract",
    "freelance",
  ];

  const experienceLevels = ["entry", "junior", "mid", "senior", "lead"];

  const jobCategories = [
    "technology",
    "design",
    "marketing",
    "sales",
    "business",
    "finance",
    "hr",
    "support",
    "operations",
  ];

  return (
    <div
      className={`bg-[#f3f3f3] rounded-lg ${
        isMobile
          ? "block w-full h-full mt-7"
          : "hidden md:block md:w-[23vw] ml-7 my-4"
      }`}
    >
      {/* Salary */}
      <div className="px-4 py-5">
        <h3 className="font-semibold mb-2">Salary Range</h3>
        <div className="flex justify-between text-sm mb-2">
          <span>Rs {salary.min.toLocaleString()}</span>
          <span>Rs {salary.max.toLocaleString()}</span>
        </div>

        <input
          type="range"
          min={MIN}
          max={MAX}
          step={5000}
          value={salary.min}
          onChange={handleMinChange}
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={5000}
          value={salary.max}
          onChange={handleMaxChange}
        />
      </div>

      {/* Job Type */}
      <div className="px-4 py-4">
        <h3 className="font-semibold mb-2">Job Type</h3>
        {jobTypeOptions.map((type) => (
          <label key={type} className="flex gap-2">
            <input
              type="checkbox"
              checked={jobTypes.includes(type)}
              onChange={() => toggleArrayValue(type, setJobTypes, jobTypes)}
            />
            {type}
          </label>
        ))}
      </div>

      {/* Experience */}
      <div className="px-4 py-4">
        <h3 className="font-semibold mb-2">Experience</h3>
        {experienceLevels.map((level) => (
          <label key={level} className="flex gap-2">
            <input
              type="radio"
              name="experience"
              checked={experience === level}
              onChange={() => setExperience(level)}
            />
            {level}
          </label>
        ))}
      </div>

      {/* Categories */}
      <div className="px-4 py-4">
        <h3 className="font-semibold mb-2">Category</h3>
        {jobCategories.map((cat) => (
          <label key={cat} className="flex gap-2">
            <input
              type="checkbox"
              checked={categories.includes(cat)}
              onChange={() => toggleArrayValue(cat, setCategories, categories)}
            />
            {cat}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;
