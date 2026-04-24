"use client";
import { useState } from "react";
import PopupPassword from "../components/PopupPassword";

export default function SettingsPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState({
    jobUpdates: true,
    newJobs: true,
    marketingEmails: false,
  });

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <>
      {showPopup && <PopupPassword setShowPopup={setShowPopup} />}
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        {/* Account Settings */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <div className="space-y-2">
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="mt-2 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Change Password
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="border rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="flex flex-col space-y-2 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="jobUpdates"
                checked={notifications.jobUpdates}
                onChange={handleNotificationChange}
              />
              <span>Job updates</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="newJobs"
                checked={notifications.newJobs}
                onChange={handleNotificationChange}
              />
              <span>New jobs</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="marketingEmails"
                checked={notifications.marketingEmails}
                onChange={handleNotificationChange}
              />
              <span>Marketing emails</span>
            </label>
          </div>
        </section>

        {/* Job Preferences */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Job Preferences</h2>
          <div className="space-y-2">
            <div>
              <label className="block font-medium">Job Type</label>
              <input
                type="text"
                placeholder="Full-time, Part-time..."
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Location</label>
              <input
                type="text"
                placeholder="City, Country"
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Salary Range</label>
              <input
                type="text"
                placeholder="$40,000 - $60,000"
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Privacy</h2>
          <div>
            <label className="block font-medium">Profile visibility</label>
            <select className="mt-1 w-full border rounded px-3 py-2">
              <option>Public</option>
              <option>Private</option>
              <option>Connections Only</option>
            </select>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete Account
          </button>
        </section>
      </div>
    </>
  );
}
