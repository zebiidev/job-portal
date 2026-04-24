"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function CompanyProfilePage() {
  const inputFileRef = useRef(null);
  const coverFileRef = useRef(null);

  const [logoPreview, setLogoPreview] = useState(
    "/companies/company-placeholder.svg"
  );
  const [coverPreview, setCoverPreview] = useState("/company-placeholder.svg");

  const [profile, setProfile] = useState({
    companyName: "",
    website: "",
    industry: "",
    companySize: "",
    companyType: "",
    foundedYear: "",
    headquarters: "",
    locations: "",

    description: "",
    mission: "",
    culture: "",

    hiringContactName: "",
    hiringContactEmail: "",
    phone: "",

    benefits: "",
    perks: "",

    linkedin: "",
    twitter: "",
    facebook: "",

    verificationDoc: null,
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleLogoClick = () => {
    inputFileRef.current.click();
  };

  const handleCoverClick = () => {
    coverFileRef.current.click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">Company Profile</h2>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Branding</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Image
                src={logoPreview}
                alt="Company logo"
                width={90}
                height={90}
                className="rounded-xl object-cover"
              />
              <button
                onClick={handleLogoClick}
                className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
              >
                Change Logo
              </button>
              <input
                ref={inputFileRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>

            <div className="space-y-3">
              <Image
                src={coverPreview}
                alt="Company cover"
                width={280}
                height={120}
                className="rounded-xl object-cover w-full h-[120px]"
              />
              <button
                onClick={handleCoverClick}
                className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
              >
                Change Cover
              </button>
              <input
                ref={coverFileRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Company Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="website"
              value={profile.website}
              onChange={handleChange}
              placeholder="Website"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="industry"
              value={profile.industry}
              onChange={handleChange}
              placeholder="Industry"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="companySize"
              value={profile.companySize}
              onChange={handleChange}
              placeholder="Company Size (e.g. 51-200)"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="companyType"
              value={profile.companyType}
              onChange={handleChange}
              placeholder="Company Type (Private, Public, Startup)"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="foundedYear"
              value={profile.foundedYear}
              onChange={handleChange}
              placeholder="Founded Year"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="headquarters"
              value={profile.headquarters}
              onChange={handleChange}
              placeholder="Headquarters"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="locations"
              value={profile.locations}
              onChange={handleChange}
              placeholder="Locations (City, Country)"
              className="border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Company Story</h3>
          <textarea
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows={4}
            placeholder="Company description"
            className="border rounded-lg px-4 py-2 w-full"
          />
          <textarea
            name="mission"
            value={profile.mission}
            onChange={handleChange}
            rows={3}
            placeholder="Mission"
            className="border rounded-lg px-4 py-2 w-full"
          />
          <textarea
            name="culture"
            value={profile.culture}
            onChange={handleChange}
            rows={3}
            placeholder="Culture and values"
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Hiring Contact</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="hiringContactName"
              value={profile.hiringContactName}
              onChange={handleChange}
              placeholder="Hiring Contact Name"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="hiringContactEmail"
              value={profile.hiringContactEmail}
              onChange={handleChange}
              placeholder="Hiring Contact Email"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Benefits & Perks</h3>
          <textarea
            name="benefits"
            value={profile.benefits}
            onChange={handleChange}
            rows={3}
            placeholder="Benefits (Health, Insurance, Learning)"
            className="border rounded-lg px-4 py-2 w-full"
          />
          <textarea
            name="perks"
            value={profile.perks}
            onChange={handleChange}
            rows={3}
            placeholder="Perks (Snacks, Remote kit, Team retreats)"
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Social Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="linkedin"
              value={profile.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="twitter"
              value={profile.twitter}
              onChange={handleChange}
              placeholder="Twitter/X"
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="facebook"
              value={profile.facebook}
              onChange={handleChange}
              placeholder="Facebook"
              className="border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Verification</h3>
          <input
            type="file"
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
