"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Sparkles, Trash2 } from "lucide-react";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeUrl(url = "") {
  const trimmed = String(url).trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function parseList(value = "") {
  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickList(resumeList, fallbackText) {
  if (Array.isArray(resumeList) && resumeList.length > 0) return resumeList;
  return parseList(fallbackText);
}

function getContact(resume, input) {
  return {
    email: resume?.contact?.email || input?.email || "",
    phone: resume?.contact?.phone || input?.phone || "",
    location: resume?.contact?.location || input?.location || "",
    linkedin: resume?.contact?.linkedin || input?.linkedin || "",
    github: resume?.contact?.github || input?.github || "",
    portfolioUrl: resume?.contact?.portfolioUrl || input?.portfolioUrl || "",
  };
}

function sectionList(items = []) {
  return (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function sectionTags(items = []) {
  return (items || [])
    .map(
      (item) =>
        `<span style="display:inline-block;border:1px solid #e5e7eb;border-radius:9999px;padding:4px 10px;margin:4px;font-size:12px;">${escapeHtml(item)}</span>`,
    )
    .join("");
}

function buildPrintHtml(data) {
  const {
    resume,
    contact,
    skills,
    technicalSkills,
    tools,
    softSkills,
    languages,
    experience,
    education,
    projects,
    certifications,
    achievements,
  } = data;

  return `
    <html>
      <head>
        <title>${escapeHtml(resume?.fullName || "Resume")}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 30px; line-height: 1.45; }
          h1 { margin: 0; font-size: 30px; text-align: center; font-weight: 700; }
          .title { text-align: center; margin: 6px 0 10px; color: #374151; font-weight: 600; }
          .contact { text-align: center; font-size: 13px; color: #4b5563; margin-bottom: 12px; }
          .links { text-align: center; font-size: 13px; margin-bottom: 18px; }
          .links a { color: #111827; text-decoration: none; margin: 0 8px; }
          h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 18px 0 8px; font-weight: 700; }
          p { margin: 0; }
          ul { margin: 6px 0 0 18px; padding: 0; }
          li { margin-bottom: 6px; }
          .tags { margin-top: 6px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(resume?.fullName || "")}</h1>
        <div class="title">${escapeHtml(resume?.title || "")}</div>
        <div class="contact">
          ${escapeHtml(contact.email)} | ${escapeHtml(contact.phone)} | ${escapeHtml(contact.location)}
        </div>
        <div class="links">
          ${contact.linkedin ? `<a href="${escapeHtml(normalizeUrl(contact.linkedin))}">LinkedIn</a>` : ""}
          ${contact.github ? `<a href="${escapeHtml(normalizeUrl(contact.github))}">GitHub</a>` : ""}
          ${contact.portfolioUrl ? `<a href="${escapeHtml(normalizeUrl(contact.portfolioUrl))}">Portfolio</a>` : ""}
        </div>

        <h2>Summary</h2>
        <p>${escapeHtml(resume?.summary || "")}</p>

        <h2>Experience</h2>
        <ul>${sectionList(experience)}</ul>

        <h2>Skills</h2>
        <div class="tags">${sectionTags(skills)}</div>

        ${
          technicalSkills.length
            ? `<h2>Technical Skills</h2><div class="tags">${sectionTags(technicalSkills)}</div>`
            : ""
        }
        ${
          tools.length
            ? `<h2>Tools</h2><div class="tags">${sectionTags(tools)}</div>`
            : ""
        }
        ${
          softSkills.length
            ? `<h2>Soft Skills</h2><div class="tags">${sectionTags(softSkills)}</div>`
            : ""
        }
        ${
          languages.length
            ? `<h2>Languages</h2><div class="tags">${sectionTags(languages)}</div>`
            : ""
        }

        <h2>Education</h2>
        <ul>${sectionList(education)}</ul>

        ${projects.length ? `<h2>Projects</h2><ul>${sectionList(projects)}</ul>` : ""}
        ${certifications.length ? `<h2>Certifications</h2><ul>${sectionList(certifications)}</ul>` : ""}
        ${achievements.length ? `<h2>Achievements</h2><ul>${sectionList(achievements)}</ul>` : ""}
      </body>
    </html>
  `;
}

function ResumeSection({ title, children }) {
  return (
    <section>
      <h3 className="text-sm uppercase tracking-[0.2em] text-gray-700 font-bold">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export default function AiResumePreviewPage() {
  const [resume, setResume] = useState(() => {
    if (typeof window === "undefined") return null;
    const rawResume = sessionStorage.getItem("aiResumeGenerated");
    if (!rawResume) return null;
    try {
      return JSON.parse(rawResume);
    } catch {
      return null;
    }
  });
  const [input, setInput] = useState(() => {
    if (typeof window === "undefined") return null;
    const rawInput = sessionStorage.getItem("aiResumeInput");
    if (!rawInput) return null;
    try {
      return JSON.parse(rawInput);
    } catch {
      return null;
    }
  });

  const hasResume = useMemo(() => Boolean(resume?.fullName), [resume]);
  const contact = useMemo(() => getContact(resume, input), [resume, input]);

  const experience = useMemo(
    () => pickList(resume?.experience, input?.experience),
    [resume, input],
  );
  const education = useMemo(
    () => pickList(resume?.education, input?.education),
    [resume, input],
  );
  const skills = useMemo(
    () => pickList(resume?.skills, input?.skills),
    [resume, input],
  );
  const technicalSkills = useMemo(
    () => pickList(resume?.technicalSkills, input?.technicalSkills),
    [resume, input],
  );
  const tools = useMemo(
    () => pickList(resume?.tools, input?.tools),
    [resume, input],
  );
  const softSkills = useMemo(
    () => pickList(resume?.softSkills, input?.softSkills),
    [resume, input],
  );
  const languages = useMemo(
    () => pickList(resume?.languages, input?.languages),
    [resume, input],
  );
  const projects = useMemo(
    () => pickList(resume?.projects, input?.projects),
    [resume, input],
  );
  const certifications = useMemo(
    () => pickList(resume?.certifications, input?.certifications),
    [resume, input],
  );
  const achievements = useMemo(
    () => pickList(resume?.achievements, input?.achievements),
    [resume, input],
  );

  const handleDownloadPdf = () => {
    if (!hasResume) return;

    const html = buildPrintHtml({
      resume,
      contact,
      skills,
      technicalSkills,
      tools,
      softSkills,
      languages,
      experience,
      education,
      projects,
      certifications,
      achievements,
    });
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDeleteResume = () => {
    sessionStorage.removeItem("aiResumeGenerated");
    sessionStorage.removeItem("aiResumeInput");
    setResume(null);
    setInput(null);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
              AI Resume Preview
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mt-3">
              {hasResume
                ? "Your resume is ready."
                : "No generated resume found."}
            </h1>
            <p className="text-gray-600 mt-2">
              {hasResume
                ? "Review the generated layout and download PDF when you are satisfied."
                : "Generate your resume first, then return to this page."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteResume}
              disabled={!hasResume}
              className={`px-5 py-3 rounded-xl font-semibold transition inline-flex items-center gap-2 ${
                hasResume
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Delete Resume
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={!hasResume}
              className={`px-5 py-3 rounded-xl font-semibold transition inline-flex items-center gap-2 ${
                hasResume
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_260px] gap-6">
          <div className="border border-black/10 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                {resume?.fullName || "Your Name"}
              </h2>
              <p className="text-gray-700 font-semibold mt-1">
                {resume?.title || "Professional Title"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {contact.email || "email@example.com"} |{" "}
                {contact.phone || "+1 000 000 0000"} |{" "}
                {contact.location || "Location"}
              </p>
              <div className="text-sm mt-2 flex items-center justify-center gap-4 flex-wrap">
                {contact.linkedin ? (
                  <a
                    href={normalizeUrl(contact.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 font-semibold"
                  >
                    LinkedIn
                  </a>
                ) : null}
                {contact.github ? (
                  <a
                    href={normalizeUrl(contact.github)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 font-semibold"
                  >
                    GitHub
                  </a>
                ) : null}
                {contact.portfolioUrl ? (
                  <a
                    href={normalizeUrl(contact.portfolioUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 font-semibold"
                  >
                    Portfolio
                  </a>
                ) : null}
              </div>
              <span className="inline-block mt-3 text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">
                ATS Ready
              </span>
            </div>

            <div className="mt-8 space-y-6 text-sm text-gray-700">
              <ResumeSection title="Summary">
                <p className="text-gray-700">
                  {resume?.summary ||
                    "This area will display the AI generated summary based on the details you submitted."}
                </p>
              </ResumeSection>

              <ResumeSection title="Experience">
                <ul className="space-y-2 list-disc pl-5">
                  {(experience.length
                    ? experience
                    : [
                        "Role at company with achievement-driven impact statements.",
                        "Key contribution with measurable outcomes.",
                      ]
                  ).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ResumeSection>

              <ResumeSection title="Skills">
                <div className="flex flex-wrap gap-2 text-xs">
                  {(skills.length
                    ? skills
                    : ["Skill One", "Skill Two", "Skill Three"]
                  ).map((skill) => (
                    <span
                      key={skill}
                      className="border border-black/10 rounded-full px-3 py-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </ResumeSection>

              {technicalSkills.length ? (
                <ResumeSection title="Technical Skills">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {technicalSkills.map((item) => (
                      <span
                        key={item}
                        className="border border-black/10 rounded-full px-3 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </ResumeSection>
              ) : null}

              {tools.length ? (
                <ResumeSection title="Tools">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {tools.map((item) => (
                      <span
                        key={item}
                        className="border border-black/10 rounded-full px-3 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </ResumeSection>
              ) : null}

              {softSkills.length ? (
                <ResumeSection title="Soft Skills">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {softSkills.map((item) => (
                      <span
                        key={item}
                        className="border border-black/10 rounded-full px-3 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </ResumeSection>
              ) : null}

              {languages.length ? (
                <ResumeSection title="Languages">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {languages.map((item) => (
                      <span
                        key={item}
                        className="border border-black/10 rounded-full px-3 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </ResumeSection>
              ) : null}

              <ResumeSection title="Education">
                <ul className="space-y-2 list-disc pl-5">
                  {(education.length
                    ? education
                    : ["Degree - School, Year"]
                  ).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ResumeSection>

              {projects.length ? (
                <ResumeSection title="Projects">
                  <ul className="space-y-2 list-disc pl-5">
                    {projects.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </ResumeSection>
              ) : null}

              {certifications.length ? (
                <ResumeSection title="Certifications">
                  <ul className="space-y-2 list-disc pl-5">
                    {certifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </ResumeSection>
              ) : null}

              {achievements.length ? (
                <ResumeSection title="Achievements">
                  <ul className="space-y-2 list-disc pl-5">
                    {achievements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </ResumeSection>
              ) : null}
            </div>
          </div>

          <aside className="border border-black/10 rounded-3xl p-6 bg-white h-fit">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              AI Notes
            </div>
            <div className="mt-3 space-y-4 text-sm text-gray-600">
              <p>
                {hasResume
                  ? "Optional sections are added only when data is provided."
                  : "Generate from the form to load your AI response on this page."}
              </p>
              <div>
                <p className="font-semibold text-black">Highlights</p>
                <ul className="mt-2 space-y-2 list-disc pl-5">
                  {(resume?.highlights?.length
                    ? resume.highlights.slice(0, 3)
                    : ["AI-generated highlights will appear here."]
                  ).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-black">ATS Keywords</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(resume?.atsKeywords?.length
                    ? resume.atsKeywords.slice(0, 10)
                    : ["Keywords"]
                  ).map((item) => (
                    <span
                      key={item}
                      className="border border-black/10 rounded-full px-3 py-1 text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {(resume?.targetRole || input?.jobTarget) && (
                <div>
                  <p className="font-semibold text-black">Target Role</p>
                  <p className="mt-1">
                    {resume?.targetRole || input?.jobTarget}
                  </p>
                </div>
              )}
              {(resume?.experienceLevel || input?.experienceLevel) && (
                <div>
                  <p className="font-semibold text-black">Experience Level</p>
                  <p className="mt-1">
                    {resume?.experienceLevel || input?.experienceLevel}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <Link
                href="/ai-resume"
                className="text-sm font-semibold underline underline-offset-4"
              >
                Edit resume details
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
