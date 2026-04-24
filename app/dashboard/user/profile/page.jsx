"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function ProfileRightPanel() {
  const inputFileRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(
    "/companies/company-placeholder.svg"
  );

  const [profile, setProfile] = useState({
    name: "Ahmed Khan",
    email: "ahmed@gmail.com",
    location: "",
    phone: "",

    headline: "",
    role: "",
    secondaryRole: "",
    experienceLevel: "",
    yearsOfExperience: "",
    currentCompany: "",
    employmentType: "",
    workAuthorization: "",
    preferredLocations: "",
    relocation: "no",

    primarySkill: "",
    skills: "",
    languages: "",
    certifications: "",

    openToWork: "yes",
    noticePeriod: "",
    expectedSalary: "",
    salaryCurrency: "INR",

    about: "",
    resume: null,
    linkedin: "",
    github: "",
    portfolio: "",

    highestEducation: "",
    institution: "",
    graduationYear: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    inputFileRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">My Profile</h2>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Basic Information</h3>

          <div className="flex items-center gap-4">
            <Image
              src={selectedImage}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <button
              onClick={handleImageClick}
              className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
            >
              Change Photo
            </button>
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="email"
              value={profile.email}
              disabled
              className="border rounded-lg px-4 py-2 bg-gray-100"
            />

            <input
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="Location"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Professional Information</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="headline"
              value={profile.headline}
              onChange={handleChange}
              placeholder="Headline (e.g. Frontend Engineer | React | Next.js)"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="currentCompany"
              value={profile.currentCompany}
              onChange={handleChange}
              placeholder="Current Company"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="role"
              value={profile.role}
              onChange={handleChange}
              placeholder="Primary Role (e.g. Frontend Developer)"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="secondaryRole"
              value={profile.secondaryRole}
              onChange={handleChange}
              placeholder="Secondary Role (Optional)"
              className="border rounded-lg px-4 py-2"
            />

            <select
              name="experienceLevel"
              value={profile.experienceLevel}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Experience Level</option>
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
              <option>Lead</option>
            </select>

            <input
              name="yearsOfExperience"
              value={profile.yearsOfExperience}
              onChange={handleChange}
              placeholder="Years of Experience (e.g. 3)"
              className="border rounded-lg px-4 py-2"
            />

            <select
              name="employmentType"
              value={profile.employmentType}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Employment Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>

            <input
              name="workAuthorization"
              value={profile.workAuthorization}
              onChange={handleChange}
              placeholder="Work Authorization (e.g. India, US H1B)"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="preferredLocations"
              value={profile.preferredLocations}
              onChange={handleChange}
              placeholder="Preferred Locations (City, Country)"
              className="border rounded-lg px-4 py-2"
            />

            <select
              name="relocation"
              value={profile.relocation}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="no">Open to Relocation</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Skills</h3>

          <input
            name="primarySkill"
            value={profile.primarySkill}
            onChange={handleChange}
            placeholder="Primary Skill (e.g. React)"
            className="border rounded-lg px-4 py-2 w-full"
          />

          <input
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="Other Skills (React, Node, MongoDB)"
            className="border rounded-lg px-4 py-2 w-full"
          />

          <input
            name="languages"
            value={profile.languages}
            onChange={handleChange}
            placeholder="Languages (English, Hindi)"
            className="border rounded-lg px-4 py-2 w-full"
          />

          <input
            name="certifications"
            value={profile.certifications}
            onChange={handleChange}
            placeholder="Certifications (AWS, Google, Scrum)"
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Availability & Preferences</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="openToWork"
              value={profile.openToWork}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="yes">Open to Work</option>
              <option value="no">Not Looking</option>
            </select>

            <input
              name="noticePeriod"
              value={profile.noticePeriod}
              onChange={handleChange}
              placeholder="Notice Period (e.g. 30 days)"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="expectedSalary"
              value={profile.expectedSalary}
              onChange={handleChange}
              placeholder="Expected Salary (e.g. 10,00,000)"
              className="border rounded-lg px-4 py-2"
            />

            <select
              name="salaryCurrency"
              value={profile.salaryCurrency}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Education</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="highestEducation"
              value={profile.highestEducation}
              onChange={handleChange}
              placeholder="Highest Education (B.Tech, B.Sc, MBA)"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="institution"
              value={profile.institution}
              onChange={handleChange}
              placeholder="Institution"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="graduationYear"
              value={profile.graduationYear}
              onChange={handleChange}
              placeholder="Graduation Year"
              className="border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">About Me</h3>

          <textarea
            name="about"
            value={profile.about}
            onChange={handleChange}
            rows={4}
            placeholder="Write a short professional summary..."
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Resume & Links</h3>

          <input type="file" className="border rounded-lg px-4 py-2 w-full" />

          <input
            name="linkedin"
            value={profile.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn Profile URL"
            className="border rounded-lg px-4 py-2 w-full"
          />

          <input
            name="github"
            value={profile.github}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="border rounded-lg px-4 py-2 w-full"
          />

          <input
            name="portfolio"
            value={profile.portfolio}
            onChange={handleChange}
            placeholder="Portfolio Website"
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div className="flex justify-end">
          <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
