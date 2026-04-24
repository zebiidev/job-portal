"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const initialForm = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolioUrl: "",
  summary: "",
  skills: "",
  technicalSkills: "",
  tools: "",
  softSkills: "",
  languages: "",
  experience: "",
  education: "",
  projects: "",
  certifications: "",
  achievements: "",
  jobTarget: "",
  experienceLevel: "",
  jobDescription: "",
};

export default function AiResumePage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isValid = useMemo(() => {
    return (
      form.fullName.trim() &&
      form.title.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.location.trim() &&
      form.summary.trim() &&
      form.skills.trim() &&
      form.experience.trim() &&
      form.education.trim()
    );
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/ai-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to generate resume");
      }

      sessionStorage.setItem("aiResumeInput", JSON.stringify(form));
      sessionStorage.setItem("aiResumeGenerated", JSON.stringify(data.resume));
      router.push("/ai-resume/preview");
    } catch (submitError) {
      setError(
        submitError?.message ||
          "Something went wrong while generating your resume.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            AI Resume
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">
            Provide the essentials. We will craft the resume.
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Fill out the required fields. Once everything is complete, the
            Generate with AI button will unlock.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-black/10 rounded-3xl p-6 md:p-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <input
              className="border border-black/10 rounded-xl px-4 py-3 text-sm"
              placeholder="Full name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <input
              className="border border-black/10 rounded-xl px-4 py-3 text-sm"
              placeholder="Professional title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <input
              className="border border-black/10 rounded-xl px-4 py-3 text-sm"
              placeholder="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="border border-black/10 rounded-xl px-4 py-3 text-sm"
              placeholder="Phone number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              className="border border-black/10 rounded-xl px-4 py-3 text-sm"
              placeholder="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
            <input
              className="border border-black/10 rounded-xl px-4 py-3 text-sm"
              placeholder="LinkedIn profile URL"
              name="linkedin"
              type="url"
              value={form.linkedin}
              onChange={handleChange}
            />
            <input
              className="border border-black/10 rounded-xl px-4 py-3 text-sm"
              placeholder="GitHub profile URL"
              name="github"
              type="url"
              value={form.github}
              onChange={handleChange}
            />
            <input
              className="border border-black/10 rounded-xl px-4 py-3 text-sm"
              placeholder="Key skills (comma separated)"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-5 space-y-4">
            <textarea
              className="border border-black/10 resize-none rounded-xl px-4 py-3 text-sm min-h-[110px] w-full"
              placeholder="Professional summary"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              required
            />
            <textarea
              className="border border-black/10 resize-none rounded-xl px-4 py-3 text-sm min-h-[130px] w-full"
              placeholder="Experience (company, role, achievements)"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              required
            />
            <textarea
              className="border border-black/10 resize-none rounded-xl px-4 py-3 text-sm min-h-[90px] w-full"
              placeholder="Education (degree, school, year)"
              name="education"
              value={form.education}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Optional professional details
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <input
                className="border border-black/10 rounded-xl px-4 py-3 text-sm"
                placeholder="Portfolio URL"
                name="portfolioUrl"
                type="url"
                value={form.portfolioUrl}
                onChange={handleChange}
              />
              <input
                className="border border-black/10 rounded-xl px-4 py-3 text-sm"
                placeholder="Target job role"
                name="jobTarget"
                value={form.jobTarget}
                onChange={handleChange}
              />
              <input
                className="border border-black/10 rounded-xl px-4 py-3 text-sm"
                placeholder="Experience level (e.g. Entry, Mid, Senior)"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
              />
              <input
                className="border border-black/10 rounded-xl px-4 py-3 text-sm"
                placeholder="Technical skills (comma separated)"
                name="technicalSkills"
                value={form.technicalSkills}
                onChange={handleChange}
              />
              <input
                className="border border-black/10 rounded-xl px-4 py-3 text-sm"
                placeholder="Tools (comma separated)"
                name="tools"
                value={form.tools}
                onChange={handleChange}
              />
              <input
                className="border border-black/10 rounded-xl px-4 py-3 text-sm"
                placeholder="Soft skills (comma separated)"
                name="softSkills"
                value={form.softSkills}
                onChange={handleChange}
              />
              <input
                className="border border-black/10 rounded-xl px-4 py-3 text-sm md:col-span-2"
                placeholder="Languages (comma separated)"
                name="languages"
                value={form.languages}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4 space-y-4">
              <textarea
                className="border border-black/10 resize-none rounded-xl px-4 py-3 text-sm min-h-[90px] w-full"
                placeholder="Projects (project name, stack, outcome)"
                name="projects"
                value={form.projects}
                onChange={handleChange}
              />
              <textarea
                className="border border-black/10 resize-none rounded-xl px-4 py-3 text-sm min-h-[90px] w-full"
                placeholder="Certifications (name, issuer, year)"
                name="certifications"
                value={form.certifications}
                onChange={handleChange}
              />
              <textarea
                className="border border-black/10 resize-none rounded-xl px-4 py-3 text-sm min-h-[90px] w-full"
                placeholder="Achievements/Awards (optional)"
                name="achievements"
                value={form.achievements}
                onChange={handleChange}
              />
              <textarea
                className="border border-black/10 resize-none rounded-xl px-4 py-3 text-sm min-h-[110px] w-full"
                placeholder="Paste target job description (optional)"
                name="jobDescription"
                value={form.jobDescription}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-black" />
              Required fields are marked by this form.
            </div>
            {error ? (
              <p className="w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                isValid && !isSubmitting
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Generating..." : "Generate with AI"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
