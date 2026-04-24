"use client";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@jobportal.com",
    password: "",
    notifications: {
      jobUpdates: true,
      newCompanies: true,
      marketingEmails: false,
    },
    platformName: "Job Portal",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in profile.notifications) {
      setProfile({
        ...profile,
        notifications: { ...profile.notifications, [name]: checked },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = () => {
    console.log("Saving settings...", profile);
    alert("Settings saved!");
  };

  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-black">Admin Settings</h1>

        {/* Account Settings */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Account Settings</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Name"
              className="border rounded-lg px-4 py-2"
            />

            <input
              name="email"
              value={profile.email}
              disabled
              className="border rounded-lg px-4 py-2 bg-gray-100"
            />

            <button
              onClick={() => setShowPasswordPopup(true)}
              className="border rounded-lg px-4 py-2 w-full md:col-span-2 bg-gray-50 hover:bg-gray-100 transition"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Notifications</h3>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="jobUpdates"
                checked={profile.notifications.jobUpdates}
                onChange={handleChange}
              />
              Job Updates
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="newCompanies"
                checked={profile.notifications.newCompanies}
                onChange={handleChange}
              />
              New Companies
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="marketingEmails"
                checked={profile.notifications.marketingEmails}
                onChange={handleChange}
              />
              Marketing Emails
            </label>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Platform Settings</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="platformName"
              value={profile.platformName}
              onChange={handleChange}
              placeholder="Platform Name"
              className="border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg text-red-600">Danger Zone</h3>

          <button className="w-full border px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition">
            Delete Admin Account
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Change Password Popup */}
      {showPasswordPopup && (
        <div
          onClick={() => setShowPasswordPopup(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl w-[400px] p-6 relative"
          >
            <span
              onClick={() => setShowPasswordPopup(false)}
              className="absolute right-4 top-4 text-2xl cursor-pointer hover:text-red-500"
            >
              <IoMdClose />
            </span>

            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="New Password"
              className="border rounded-lg px-4 py-2 w-full mb-3"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border rounded-lg px-4 py-2 w-full mb-3"
            />

            <button className="bg-black text-white px-6 py-2 rounded-lg w-full hover:bg-gray-900 transition">
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
