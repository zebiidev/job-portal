"use client";
import React, { useEffect, useState } from "react";
import {
  Code,
  BarChart3,
  Smartphone,
  Cloud,
  Database,
  Server,
  Rocket,
  Settings,
  GitBranch,
  Zap,
} from "lucide-react";
import StacksPopup from "./StacksPopup";
import Difficluty from "./Difficluty";
import Mcqs from "./Mcqs";

const STEP_KEY = "interview-prep-step";
const STATE_KEY = "interview-prep-state";
const CACHE_KEY = "interview-prep-session";

const SelectStacks = () => {
  const [selectedStack, setSelectedStack] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [steps, setSteps] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const stacks = [
    {
      id: "webDevelopment",
      title: "Web Development",
      icon: <Code size={40} />,
    },
    { id: "dataScience", title: "Data Science", icon: <BarChart3 size={40} /> },
    {
      id: "mobileDevelopment",
      title: "Mobile Development",
      icon: <Smartphone size={40} />,
    },
    { id: "cloudAWS", title: "Cloud / AWS", icon: <Cloud size={40} /> },
    {
      id: "backendDevelopment",
      title: "Backend Development",
      icon: <Server size={40} />,
    },
    { id: "database", title: "Database", icon: <Database size={40} /> },
    {
      id: "gitVersionControl",
      title: "Git / Version Control",
      icon: <GitBranch size={40} />,
    },
    {
      id: "automationCICD",
      title: "Automation / CI-CD",
      icon: <Zap size={40} />,
    },
    { id: "blockchain", title: "Blockchain", icon: <Rocket size={40} /> },
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      icon: <Settings size={40} />,
    },
  ];

  const selectedStackTitle =
    stacks.find((item) => item.id === selectedStack)?.title || selectedStack;

  const generateMcqs = async (difficulty) => {
    setLoading(true);
    setError("");
    setMcqs([]);

    try {
      const cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");
      const excludeQuestions = Array.isArray(cache?.mcqs)
        ? cache.mcqs.map((item) => item?.question).filter(Boolean)
        : [];

      const res = await fetch("/api/generate-mcqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stack: selectedStack,
          difficulty,
          excludeQuestions,
        }),
      });

      if (!res.ok) {
        const failedData = await res.json().catch(() => ({}));
        throw new Error(failedData?.message || "Failed to generate MCQs");
      }

      const data = await res.json();
      if (!Array.isArray(data?.mcqs) || data.mcqs.length === 0) {
        throw new Error("No MCQs generated. Please try again.");
      }

      setMcqs(data.mcqs);
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          stack: selectedStack,
          difficulty,
          mcqs: data.mcqs,
          updatedAt: Date.now(),
        }),
      );
      setSteps(3);
    } catch (err) {
      console.error("Error generating MCQs", err);
      setError(err?.message || "Error generating MCQs");
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setError("");
  };

  const handleStack = (stackId) => {
    setSelectedStack(stackId);
    setSelectedDifficulty(null);
    setMcqs([]);
    setError("");
    sessionStorage.removeItem(CACHE_KEY);
    setShowPopup(true);
  };

  const ChangeStep = async () => {
    if (steps === 1) {
      if (!selectedStack) {
        setError("Please select a stack first.");
        return;
      }
      setError("");
      setSteps(2);
      return;
    }

    if (steps === 2) {
      if (!selectedDifficulty) {
        setError("Please select a difficulty first.");
        return;
      }
      await generateMcqs(selectedDifficulty);
    }
  };

  const PrevStep = () => {
    if (steps > 1) {
      setError("");
      setSteps((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const savedStep = localStorage.getItem(STEP_KEY);
    const savedState = JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
    const cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");

    if (savedState?.selectedStack) {
      setSelectedStack(savedState.selectedStack);
    }
    if (savedState?.selectedDifficulty) {
      setSelectedDifficulty(savedState.selectedDifficulty);
    }

    if (Array.isArray(cache?.mcqs) && cache.mcqs.length > 0) {
      setMcqs(cache.mcqs);
      if (cache?.stack) setSelectedStack(cache.stack);
      if (cache?.difficulty) setSelectedDifficulty(cache.difficulty);
    }

    if (savedStep) {
      const parsedStep = Number(JSON.parse(savedStep));
      if (
        parsedStep === 3 &&
        (!Array.isArray(cache?.mcqs) || cache.mcqs.length === 0)
      ) {
        setSteps(2);
      } else if (!Number.isNaN(parsedStep) && parsedStep >= 1 && parsedStep <= 3) {
        setSteps(parsedStep);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STEP_KEY, JSON.stringify(steps));
  }, [steps, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify({
        selectedStack,
        selectedDifficulty,
      }),
    );
  }, [selectedStack, selectedDifficulty, hydrated]);

  const nextDisabled =
    (steps === 1 && !selectedStack) || (steps === 2 && (!selectedDifficulty || loading));

  const nextLabel = steps === 2 ? "Start Interview" : "Next";

  return (
    <>
      <h1 className="w-full text-center my-5 text-2xl font-semibold">
        {steps === 1
          ? "Select Your Stacks"
          : steps === 2
            ? "Select Difficulty"
            : "Interview"}
      </h1>

      <div className="px-7 flex gap-5">
        <button
          onClick={PrevStep}
          className="px-3 py-1 bg-black text-white cursor-pointer rounded-md"
        >
          Prev
        </button>
        <button
          disabled={nextDisabled}
          onClick={() => {
            void ChangeStep();
          }}
          className={`px-3 py-1 rounded-md ${
            nextDisabled
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-black text-white cursor-pointer"
          }`}
        >
          {nextLabel}
        </button>
      </div>

      {steps === 1 && (
        <div className="mb-5 flex justify-end px-7">
          <button
            onClick={() => {
              setSelectedStack(null);
              setShowPopup(true);
            }}
            className="px-3 py-2 bg-black text-white cursor-pointer rounded-md"
          >
            Choose my own
          </button>
        </div>
      )}

      {steps === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center px-7 my-16">
          {stacks.map((item) => (
            <div
              key={item.id}
              onClick={() => handleStack(item.id)}
              className="flex flex-col justify-center items-center bg-gray-300 h-[200px] w-full max-w-[250px] rounded-md cursor-pointer hover:bg-gray-400 transition"
            >
              {item.icon}
              <div className="text-xl mt-3 text-center">{item.title}</div>
            </div>
          ))}
        </div>
      )}

      {steps === 2 && (
        <Difficluty
          onSelectDifficulty={handleDifficultySelect}
          selectedDifficulty={selectedDifficulty}
        />
      )}

      {steps === 2 && loading && (
        <p className="px-7 mt-4 text-sm">Generating MCQs...</p>
      )}

      {steps === 2 && !loading && (
        <p className="px-7 mt-4 text-xs text-gray-600">
          Select difficulty, then click Start Interview.
        </p>
      )}

      {error && <p className="px-7 mt-4 text-sm text-red-600">{error}</p>}

      {showPopup && (
        <StacksPopup
          selectedStack={selectedStack}
          setShowPopup={setShowPopup}
        />
      )}

      {steps === 3 && (
        <Mcqs
          mcqs={mcqs}
          stack={selectedStackTitle}
          difficulty={selectedDifficulty}
        />
      )}
    </>
  );
};

export default SelectStacks;
