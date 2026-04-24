"use client";

import Image from "next/image";
import { Search, MapPin } from "lucide-react";

const candidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    location: "San Francisco, CA",
    skills: ["Figma", "Sketch", "Adobe XD"],
    bookmarked: "2 days ago",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 2,
    name: "James Miller",
    role: "Full Stack Developer",
    location: "New York, NY",
    skills: ["React", "Node.js", "AWS"],
    bookmarked: "3 days ago",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Digital Marketer",
    location: "Chicago, IL",
    skills: ["SEO", "Google Ads", "Social Media"],
    bookmarked: "1 week ago",
    image: "https://i.pravatar.cc/150?img=47",
  },
];

export default function SavedCandidatesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold">Saved Candidates</h1>
        <p className="text-gray-500 text-sm">
          Manage and contact your bookmarked candidates
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-full md:w-1/2 bg-white">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="outline-none w-full text-sm"
          />
        </div>

        <select className="border rounded-lg px-3 py-2 text-sm bg-white">
          <option>All Skills</option>
          <option>Frontend</option>
          <option>Backend</option>
        </select>

        <select className="border rounded-lg px-3 py-2 text-sm bg-white">
          <option>Location</option>
          <option>Remote</option>
          <option>USA</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          Sort: Newest
        </button>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white border rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between"
          >
            {/* Left */}
            <div className="flex gap-4">
              <Image
                src={candidate.image}
                alt={candidate.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />

              <div>
                <h2 className="font-semibold">{candidate.name}</h2>
                <p className="text-sm text-gray-600">{candidate.role}</p>

                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin size={14} />
                  {candidate.location}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col md:items-end gap-3">
              <span className="text-xs text-gray-400">
                Bookmarked {candidate.bookmarked}
              </span>

              <div className="flex gap-2">
                <button className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
                  View Resume
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Send email
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
