import { NextResponse } from "next/server";

function toText(value) {
  return String(value || "").trim();
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function extractJson(text = "") {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const rawFence = text.match(/```\s*([\s\S]*?)```/i);
  if (rawFence?.[1]) return rawFence[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }

  return text;
}

function normalizePayload(payload = {}) {
  const answers = Array.isArray(payload.answers)
    ? payload.answers.map((item = {}) => ({
        question: toText(item.question),
        options: Array.isArray(item.options)
          ? item.options.map((opt) => toText(opt)).slice(0, 4)
          : [],
        userSelectedIndex:
          item.userSelectedIndex === null ? null : toNumber(item.userSelectedIndex, -1),
        userSelectedOption: toText(item.userSelectedOption),
        correctAnswerIndex: toNumber(item.correctAnswerIndex, -1),
        correctAnswer: toText(item.correctAnswer),
        isCorrect: Boolean(item.isCorrect),
      }))
    : [];

  return {
    stack: toText(payload.stack),
    difficulty: toText(payload.difficulty),
    totalQuestions: toNumber(payload.totalQuestions),
    answeredQuestions: toNumber(payload.answeredQuestions),
    correctAnswers: toNumber(payload.correctAnswers),
    incorrectAnswers: toNumber(payload.incorrectAnswers),
    unattemptedQuestions: toNumber(payload.unattemptedQuestions),
    percentage: toNumber(payload.percentage),
    timeAllowedSeconds: toNumber(payload.timeAllowedSeconds),
    timeSpentSeconds: toNumber(payload.timeSpentSeconds),
    answers,
  };
}

function buildPrompt(data) {
  return `
You are a senior technical interviewer and performance coach.
Generate a concise, professional interview report from this MCQ performance data.

Candidate Performance:
- Stack: ${data.stack}
- Difficulty: ${data.difficulty}
- Total Questions: ${data.totalQuestions}
- Answered: ${data.answeredQuestions}
- Correct: ${data.correctAnswers}
- Incorrect: ${data.incorrectAnswers}
- Unattempted: ${data.unattemptedQuestions}
- Score Percentage: ${data.percentage}%
- Time Used: ${data.timeSpentSeconds} seconds out of ${data.timeAllowedSeconds}

Question-wise results:
${JSON.stringify(data.answers, null, 2)}

Rules:
1) Return ONLY valid JSON.
2) Keep tone professional, constructive, and specific.
3) Mention both technical understanding and test-taking behavior.
4) Suggestions must be actionable and practical.
5) Do not invent external certifications, projects, or job history.

Use this exact JSON schema:
{
  "stack": "string",
  "difficulty": "string",
  "overallRating": "Excellent | Strong | Good | Moderate | Needs Improvement",
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvementAreas": ["string"],
  "recommendations": ["string"],
  "actionPlan": "string"
}
`.trim();
}

async function callGemini(prompt, apiKey) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 1800,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            stack: { type: "STRING" },
            difficulty: { type: "STRING" },
            overallRating: { type: "STRING" },
            summary: { type: "STRING" },
            strengths: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            weaknesses: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            improvementAreas: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            recommendations: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            actionPlan: { type: "STRING" },
          },
          required: [
            "stack",
            "difficulty",
            "overallRating",
            "summary",
            "strengths",
            "weaknesses",
            "improvementAreas",
            "recommendations",
            "actionPlan",
          ],
        },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to generate interview report");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}

function localReport(data) {
  const percentage = data.percentage || 0;
  let overallRating = "Needs Improvement";
  if (percentage >= 85) overallRating = "Excellent";
  else if (percentage >= 75) overallRating = "Strong";
  else if (percentage >= 60) overallRating = "Good";
  else if (percentage >= 45) overallRating = "Moderate";

  const strengths = [];
  const weaknesses = [];
  const improvementAreas = [];
  const recommendations = [];

  if (data.correctAnswers >= Math.ceil(data.totalQuestions * 0.7)) {
    strengths.push("Solid conceptual understanding across the selected stack.");
    strengths.push("Good answer accuracy on core interview topics.");
  } else {
    weaknesses.push("Inconsistent correctness across core technical topics.");
  }

  if (data.unattemptedQuestions > 0) {
    weaknesses.push("Some questions were unattempted, indicating time-pressure impact.");
    improvementAreas.push("Improve time management and question pacing.");
  } else {
    strengths.push("Completed the question set without leaving items unattempted.");
  }

  if (data.incorrectAnswers > 0) {
    improvementAreas.push("Strengthen fundamentals for medium-complexity scenario questions.");
  }

  recommendations.push("Revise key concepts from incorrect questions and retake a timed set.");
  recommendations.push("Practice 20-30 minute mock tests to improve speed and confidence.");
  recommendations.push("After each mock, write short notes for patterns in mistakes.");

  const summary = `Performance in ${data.stack || "the selected stack"} at ${
    data.difficulty || "chosen"
  } difficulty is ${overallRating.toLowerCase()} with ${data.correctAnswers}/${
    data.totalQuestions
  } correct (${percentage.toFixed(0)}%).`;

  const actionPlan =
    "Follow a 7-day cycle: concept revision, targeted practice questions, and one timed mock at the end of the cycle, then review mistakes before the next round.";

  return {
    stack: data.stack,
    difficulty: data.difficulty,
    overallRating,
    summary,
    strengths: strengths.length ? strengths : ["Willingness to complete the assessment."],
    weaknesses: weaknesses.length
      ? weaknesses
      : ["Minor gaps in some advanced or edge-case topics."],
    improvementAreas: improvementAreas.length
      ? improvementAreas
      : ["Improve consistency through regular timed practice."],
    recommendations,
    actionPlan,
  };
}

function normalizeReport(report = {}, data) {
  const safeArray = (value) => (Array.isArray(value) ? value.map((item) => toText(item)).filter(Boolean) : []);

  return {
    stack: toText(report.stack) || data.stack,
    difficulty: toText(report.difficulty) || data.difficulty,
    overallRating: toText(report.overallRating) || "Moderate",
    summary: toText(report.summary),
    strengths: safeArray(report.strengths),
    weaknesses: safeArray(report.weaknesses),
    improvementAreas: safeArray(report.improvementAreas),
    recommendations: safeArray(report.recommendations),
    actionPlan: toText(report.actionPlan),
  };
}

export async function POST(req) {
  try {
    const payload = await req.json();
    const data = normalizePayload(payload);

    if (!data.totalQuestions || !data.answers.length) {
      return NextResponse.json(
        { message: "Interview data is required to generate report" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { report: localReport(data), source: "local-fallback" },
        { status: 200 },
      );
    }

    const prompt = buildPrompt(data);
    let parsed = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const finalPrompt =
        attempt === 0
          ? prompt
          : `${prompt}\n\nReturn COMPLETE valid JSON only.`;

      const text = await callGemini(finalPrompt, apiKey);
      try {
        parsed = JSON.parse(extractJson(text));
        break;
      } catch (error) {
        parsed = null;
      }
    }

    if (!parsed) {
      return NextResponse.json(
        { report: localReport(data), source: "local-fallback" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { report: normalizeReport(parsed, data), source: "gemini" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Interview report error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
