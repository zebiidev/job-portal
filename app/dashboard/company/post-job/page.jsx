"use client";

import { useForm, Controller } from "react-hook-form";
import JobDescriptionEditor from "../components/JobDescriptionEditor";

export default function PostJobForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
    };

    console.log("JOB PAYLOAD:", payload);
    // later → send payload to backend
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto bg-white p-8 rounded-lg border space-y-8"
    >
      <h1 className="text-2xl font-semibold">Post a New Job</h1>

      {/* Job Title */}
      <div>
        <label className="block mb-1 text-sm font-medium">Job Title *</label>
        <input
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Senior Frontend Developer"
          {...register("title", {
            required: "Job title is required",
          })}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Job Type / Work Type / Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Employment Type *
          </label>
          <select
            className="w-full border rounded-md px-4 py-2"
            {...register("employmentType", { required: true })}
          >
            <option value="">Select</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          {errors.employmentType && (
            <p className="text-sm text-red-600 mt-1">Required</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Work Type *</label>
          <select
            className="w-full border rounded-md px-4 py-2"
            {...register("workType", { required: true })}
          >
            <option value="">Select</option>
            <option value="onsite">Onsite</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Job Level *</label>
          <select
            className="w-full border rounded-md px-4 py-2"
            {...register("jobLevel", { required: true })}
          >
            <option value="">Select</option>
            <option value="junior">Junior</option>
            <option value="intermediate">Intermediate</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </div>

      {/* Location & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Location</label>
          <input
            className="w-full border rounded-md px-4 py-2"
            placeholder="Hyderabad, India / Remote"
            {...register("location")}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Tags (comma separated)
          </label>
          <input
            className="w-full border rounded-md px-4 py-2"
            placeholder="React, Next.js, TypeScript"
            {...register("tags")}
          />
        </div>
      </div>

      {/* Salary */}
      <div>
        <h2 className="text-lg font-medium mb-4">Salary (Optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <input
            type="number"
            placeholder="Min"
            className="w-full border rounded-md px-4 py-2"
            {...register("minSalary", { min: 0 })}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full border rounded-md px-4 py-2"
            {...register("maxSalary", { min: 0 })}
          />
          <select
            className="w-full border rounded-md px-4 py-2"
            {...register("currency")}
          >
            <option value="PKR">PKR</option>
            <option value="USD">USD</option>
          </select>
          <select
            className="w-full border rounded-md px-4 py-2"
            {...register("salaryPeriod")}
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Minimum Education
          </label>
          <select
            className="w-full border rounded-md px-4 py-2"
            {...register("education")}
          >
            <option value="">Select</option>
            <option value="high-school">High School</option>
            <option value="bachelor">Bachelor&apos;s Degree</option>
            <option value="master">Master&apos;s Degree</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Experience Requirement
          </label>
          <input
            className="w-full border rounded-md px-4 py-2"
            placeholder="3+ years of experience"
            {...register("experience")}
          />
        </div>
      </div>

      {/* Expiry Date */}
      <div>
        <label className="block mb-1 text-sm font-medium">Expiry Date</label>
        <input
          type="date"
          className="w-full border rounded-md px-4 py-2"
          {...register("expiryDate")}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          Job Description *
        </label>

        <Controller
          name="description"
          control={control}
          rules={{
            required: "Job description is required",
            validate: (value) =>
              value.replace(/<[^>]*>/g, "").length >= 50 ||
              "Minimum 50 characters required",
          }}
          render={({ field }) => (
            <JobDescriptionEditor
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {errors.description && (
          <p className="text-sm text-red-600 mt-2">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-black text-white rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </div>
    </form>
  );
}
