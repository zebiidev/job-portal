import React, { useEffect, useMemo, useState } from "react";

const Mcqs = ({ mcqs = [], stack = "", difficulty = "" }) => {
  const TOTAL_TIME = 150;
  const hasValidMcqs = Array.isArray(mcqs) && mcqs.length > 0;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [answers, setAnswers] = useState([]);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const timeUp = timeLeft === 0;

  useEffect(() => {
    if (completed || !hasValidMcqs || timeUp) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, completed, hasValidMcqs, timeUp]);

  const handleChoice = (idx) => {
    setSelectedOption(idx);
    setDisabled(false);
  };

  const handleSubmit = () => {
    const currentQuestion = mcqs[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        options: currentQuestion.options,
        userSelectedIndex: selectedOption,
        correctAnswerIndex: currentQuestion.correctAnswerIndex,
        isCorrect,
      },
    ]);

    if (currentIndex === mcqs.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setDisabled(true);
  };

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const reportPayload = useMemo(() => {
    const answered = answers.length;
    const finalAnswers = mcqs.map((item, idx) => {
      const answer = answers[idx];
      const userSelectedIndex =
        answer?.userSelectedIndex !== undefined ? answer.userSelectedIndex : null;
      const correctAnswerIndex = item.correctAnswerIndex;

      return {
        question: item.question,
        options: item.options,
        userSelectedIndex,
        userSelectedOption:
          userSelectedIndex !== null ? item.options[userSelectedIndex] : "",
        correctAnswerIndex,
        correctAnswer: item.options[correctAnswerIndex] || "",
        isCorrect: userSelectedIndex === correctAnswerIndex,
      };
    });

    const percentage =
      mcqs.length > 0 ? Number(((score / mcqs.length) * 100).toFixed(2)) : 0;

    return {
      stack,
      difficulty,
      totalQuestions: mcqs.length,
      answeredQuestions: answered,
      correctAnswers: score,
      incorrectAnswers: answered - score,
      unattemptedQuestions: mcqs.length - answered,
      percentage,
      timeAllowedSeconds: TOTAL_TIME,
      timeSpentSeconds: TOTAL_TIME - timeLeft,
      answers: finalAnswers,
    };
  }, [answers, difficulty, mcqs, score, stack, timeLeft]);

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportError("");

    try {
      const res = await fetch("/api/generate-interview-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to generate interview report");
      }

      setReport(data?.report || null);
    } catch (error) {
      console.error("Report generation failed:", error);
      setReportError(error?.message || "Failed to generate interview report");
    } finally {
      setReportLoading(false);
    }
  };

  if (!hasValidMcqs) {
    return (
      <div className="w-full min-h-screen flex justify-center mt-9">
        <div className="md:w-[60vw] bg-gray-100 rounded-md p-6 text-center">
          <h2 className="text-xl font-semibold">No MCQs available</h2>
          <p className="mt-2 text-gray-600">
            Please go back and generate questions again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center mt-9 px-4">
      <div className="w-full md:w-[70vw] bg-gray-100 rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-medium">MCQs Interview</h1>
          <div className={`font-semibold ${timeUp ? "text-red-600" : ""}`}>
            {formatTime()}
          </div>
        </div>

        <hr className="mb-6" />

        {completed || timeUp ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">
                You have completed the interview
              </h2>
              <p className="text-lg">
                Score: <b>{score}</b> / {mcqs.length} (
                {reportPayload.percentage.toFixed(0)}%)
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleGenerateReport}
                disabled={reportLoading}
                className={`px-4 py-2 rounded-md ${
                  reportLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black text-white"
                }`}
              >
                {reportLoading ? "Generating Report..." : "Generate Report"}
              </button>
            </div>

            {reportError && (
              <p className="text-center text-sm text-red-600">{reportError}</p>
            )}

            {report && (
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold">
                    Interview Performance Report
                  </h3>
                  <p className="text-sm text-gray-600">
                    {report.stack || stack} | {report.difficulty || difficulty} |
                    Overall Rating: {report.overallRating || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold">Summary</h4>
                  <p className="text-gray-700 mt-1">
                    {report.summary || "No summary available."}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-green-700">
                      Strengths
                    </h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                      {(report.strengths || []).map((item, idx) => (
                        <li key={`strength-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-700">
                      Weaknesses
                    </h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                      {(report.weaknesses || []).map((item, idx) => (
                        <li key={`weakness-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold">
                      Areas of Improvement
                    </h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                      {(report.improvementAreas || []).map((item, idx) => (
                        <li key={`improvement-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      Recommended Next Steps
                    </h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                      {(report.recommendations || []).map((item, idx) => (
                        <li key={`recommendation-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold">Action Plan</h4>
                  <p className="text-gray-700 mt-1">
                    {report.actionPlan || "No action plan available."}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="text-lg font-bold mb-6">
              {mcqs[currentIndex].question}
            </div>

            <div className="flex flex-col gap-4">
              {mcqs[currentIndex].options.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleChoice(idx)}
                  className={`px-4 py-2 rounded-md cursor-pointer ${
                    selectedOption === idx
                      ? "bg-blue-400 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={disabled || timeUp}
                className={`px-4 py-2 rounded-md ${
                  disabled || timeUp
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white"
                }`}
              >
                Submit answer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Mcqs;
