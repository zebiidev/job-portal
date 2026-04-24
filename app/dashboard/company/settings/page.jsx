"use client";

import { useState } from "react";

export default function CompanySettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    newApplications: true,
    shortlisted: true,
    weeklyDigest: true,
    marketing: false,
  });

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Company Account</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Company Name</label>
            <input
              type="text"
              placeholder="Your Company"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Company Email</label>
            <input
              type="email"
              placeholder="hr@company.com"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Support Phone</label>
            <input
              type="tel"
              placeholder="+91 00000 00000"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Time Zone</label>
            <select className="mt-1 w-full border rounded px-3 py-2">
              <option>Asia/Kolkata</option>
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
            </select>
          </div>
        </div>
      </section>

      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Hiring Preferences</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Default Job Location</label>
            <input
              type="text"
              placeholder="City, Country"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Default Work Mode</label>
            <select className="mt-1 w-full border rounded px-3 py-2">
              <option>Onsite</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Default Employment Type</label>
            <select className="mt-1 w-full border rounded px-3 py-2">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Resume Format</label>
            <select className="mt-1 w-full border rounded px-3 py-2">
              <option>PDF</option>
              <option>DOCX</option>
              <option>Any</option>
            </select>
          </div>
        </div>
      </section>

      <section className="border rounded-lg p-6 space-y-2">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <div className="flex flex-col space-y-2 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="newApplications"
              checked={notifications.newApplications}
              onChange={handleNotificationChange}
            />
            <span>New applications</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="shortlisted"
              checked={notifications.shortlisted}
              onChange={handleNotificationChange}
            />
            <span>Shortlisted candidates</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="weeklyDigest"
              checked={notifications.weeklyDigest}
              onChange={handleNotificationChange}
            />
            <span>Weekly hiring digest</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="marketing"
              checked={notifications.marketing}
              onChange={handleNotificationChange}
            />
            <span>Product updates and marketing</span>
          </label>
        </div>
      </section>

      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Security</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Change Password</label>
            <button className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-900">
              Update Password
            </button>
          </div>
          <div>
            <label className="block font-medium">Two-Factor Authentication</label>
            <button className="mt-2 px-4 py-2 border rounded hover:bg-gray-50">
              Enable 2FA
            </button>
          </div>
        </div>
      </section>

      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">API Access</h2>
        <div>
          <label className="block font-medium">API Key</label>
          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <input
              type={showApiKey ? "text" : "password"}
              readOnly
              value="jp_demo_0123456789abcdef"
              className="w-full border rounded px-3 py-2"
            />
            <button
              onClick={() => setShowApiKey((prev) => !prev)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              {showApiKey ? "Hide" : "Show"}
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">
              Regenerate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Use the API key to integrate with your ATS or internal tools.
          </p>
        </div>
      </section>

      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2 border border-red-500 text-red-600 rounded hover:bg-red-50">
            Suspend Hiring
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete Company Account
          </button>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}
