"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

const frameworkSuggestions = {
  webDevelopment: "React, Next.js, Tailwind",
  dataScience: "Python, Pandas, NumPy",
  mobileDevelopment: "React Native, Flutter",
  cloudAWS: "EC2, S3, Lambda",
  backendDevelopment: "Node.js, Express",
};

const StacksPopup = ({ setShowPopup, selectedStack }) => {
  const [course, setCourse] = useState(selectedStack || "");
  const [frameworks, setFrameworks] = useState(
    frameworkSuggestions[selectedStack] || "",
  );

  const handleSubmit = () => {
    const payload = {
      stack: course,
      frameworks,
    };

    console.log("Future Gemini Payload:", payload);

    setShowPopup(false);
  };

  return (
    <div
      onClick={() => setShowPopup(false)}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[90%] max-w-md p-6 rounded-xl relative space-y-4"
      >
        <button
          onClick={() => setShowPopup(false)}
          className="absolute right-4 top-4 text-xl"
        >
          <IoMdClose />
        </button>

        <h2 className="text-xl font-semibold">Custom Stack</h2>

        <input
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Course / Stack (eg Web Development)"
          className="border rounded-lg px-4 py-2 w-full"
        />

        <input
          value={frameworks}
          onChange={(e) => setFrameworks(e.target.value)}
          placeholder="Frameworks / Libraries"
          className="border rounded-lg px-4 py-2 w-full"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black cursor-pointer text-white py-2 rounded-lg mt-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StacksPopup;
