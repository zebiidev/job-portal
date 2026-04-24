import { NextResponse } from "next/server";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizePayload(payload = {}) {
  return {
    stack: normalizeText(payload.stack),
    difficulty: normalizeText(payload.difficulty),
    excludeQuestions: Array.isArray(payload.excludeQuestions)
      ? payload.excludeQuestions.map((item) => normalizeText(item)).filter(Boolean)
      : [],
  };
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

function sanitizeJsonString(value = "") {
  return String(value)
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/\u0000/g, "")
    .trim();
}

function tryParseGeminiJson(rawText = "") {
  const attempts = [];
  const extracted = extractJson(rawText);

  attempts.push(rawText);
  attempts.push(extracted);
  attempts.push(sanitizeJsonString(rawText));
  attempts.push(sanitizeJsonString(extracted));

  const firstArrayStart = rawText.indexOf("[");
  const lastArrayEnd = rawText.lastIndexOf("]");
  if (firstArrayStart !== -1 && lastArrayEnd > firstArrayStart) {
    const arraySlice = rawText.slice(firstArrayStart, lastArrayEnd + 1);
    attempts.push(arraySlice);
    attempts.push(`{"mcqs":${arraySlice}}`);
  }

  let lastError = null;
  for (const candidate of attempts) {
    if (!candidate) continue;
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) {
        return { parsed: { mcqs: parsed }, parseError: null };
      }
      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.mcqs)) {
          return { parsed, parseError: null };
        }
        if (Array.isArray(parsed.questions)) {
          return { parsed: { mcqs: parsed.questions }, parseError: null };
        }
      }
    } catch (error) {
      lastError = error;
    }
  }

  return { parsed: null, parseError: lastError };
}

function buildPrompt({ stack, difficulty, excludeQuestions = [] }, nonce) {
  const avoidBlock =
    excludeQuestions.length > 0
      ? `\nQuestions to avoid repeating:\n- ${excludeQuestions.join("\n- ")}\n`
      : "";

  return `
You are an expert technical interviewer.
Generate exactly 10 multiple-choice questions for interview preparation.

Context:
- Stack: ${stack}
- Difficulty: ${difficulty}
- Variation token: ${nonce}
${avoidBlock}

Rules:
1) Return ONLY valid JSON.
2) Each question must have 4 options.
3) Exactly one correct option per question.
4) Use practical, interview-relevant questions.
5) Avoid duplicate questions.
6) Keep questions concise and unambiguous.
7) Prefer scenario-based and concept-application questions over generic trivia.
8) Do not repeat wording patterns in consecutive questions.

Use this exact schema:
{
  "mcqs": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswerIndex": 0
    }
  ]
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
        temperature: 0.85,
        topP: 0.9,
        maxOutputTokens: 2200,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            mcqs: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  question: { type: "STRING" },
                  options: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                    minItems: 4,
                    maxItems: 4,
                  },
                  correctAnswerIndex: {
                    type: "INTEGER",
                  },
                },
                required: ["question", "options", "correctAnswerIndex"],
              },
              minItems: 10,
              maxItems: 10,
            },
          },
          required: ["mcqs"],
        },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to generate MCQs");
  }

  const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return {
    text,
    finishReason: candidate?.finishReason || "UNKNOWN",
  };
}

function canonicalizeQuestion(question = "") {
  return normalizeText(question).toLowerCase().replace(/\s+/g, " ");
}

function normalizeMcqs(rawMcqs = [], blocked = new Set()) {
  if (!Array.isArray(rawMcqs)) return [];
  const seen = new Set([...blocked]);

  return rawMcqs
    .map((item, index) => {
      const question = normalizeText(item?.question);
      const options = Array.isArray(item?.options)
        ? item.options.map((opt) => normalizeText(opt)).slice(0, 4)
        : [];
      const answerIndex = Number(item?.correctAnswerIndex);

      if (!question || options.length !== 4) return null;
      if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) {
        return null;
      }
      const canonicalQuestion = canonicalizeQuestion(question);
      if (!canonicalQuestion || seen.has(canonicalQuestion)) {
        return null;
      }
      seen.add(canonicalQuestion);

      return {
        id: index + 1,
        question,
        options,
        correctAnswerIndex: answerIndex,
      };
    })
    .filter(Boolean);
}

function buildLocalFallbackMcqs(input, blocked = new Set(), count = 10) {
  const stack = normalizeText(input.stack || "software development");
  const difficulty = normalizeText(input.difficulty || "Medium");

  const templates = [
    {
      question: `In a ${stack} project, what is the best first step when a production bug appears after deployment?`,
      options: [
        "Rollback or mitigate user impact, then investigate root cause",
        "Immediately refactor unrelated modules",
        "Ignore logs and wait for more reports",
        "Delete failing feature code without backup",
      ],
      correctAnswerIndex: 0,
    },
    {
      question: `Which practice most improves reliability in ${stack} applications at ${difficulty} level?`,
      options: [
        "Skipping tests for faster delivery",
        "Using version control with code review and automated tests",
        "Editing code directly on production server",
        "Hardcoding all configuration values",
      ],
      correctAnswerIndex: 1,
    },
    {
      question: `When optimizing performance in ${stack}, what should you do before making major changes?`,
      options: [
        "Profile and measure bottlenecks",
        "Rewrite the whole codebase",
        "Disable monitoring tools",
        "Increase server size only",
      ],
      correctAnswerIndex: 0,
    },
    {
      question: `What is a strong approach to handling errors in ${stack} systems?`,
      options: [
        "Suppress all errors silently",
        "Use structured logging and meaningful error responses",
        "Return success even on failure",
        "Catch errors but never alert",
      ],
      correctAnswerIndex: 1,
    },
    {
      question: `For maintainable ${stack} code, which principle is most important?`,
      options: [
        "Large functions with mixed concerns",
        "Single responsibility and clear module boundaries",
        "Duplicating logic in multiple files",
        "Avoiding documentation",
      ],
      correctAnswerIndex: 1,
    },
    {
      question: `How should secrets be handled in a ${stack} application?`,
      options: [
        "Commit them into source code for convenience",
        "Store in environment variables or secret manager",
        "Share in team chat permanently",
        "Embed in frontend bundle",
      ],
      correctAnswerIndex: 1,
    },
    {
      question: `What is the best way to prevent regressions while extending ${stack} features?`,
      options: [
        "Remove older tests",
        "Write tests for critical paths and edge cases",
        "Test only manually once",
        "Skip peer review",
      ],
      correctAnswerIndex: 1,
    },
    {
      question: `In technical interviews for ${stack}, scenario-based questions usually assess what most directly?`,
      options: [
        "Memorization only",
        "Problem-solving and practical decision making",
        "Typing speed",
        "Ability to avoid tradeoffs",
      ],
      correctAnswerIndex: 1,
    },
    {
      question: `If an API in your ${stack} app becomes slow under load, what is a strong immediate action?`,
      options: [
        "Ignore and continue deployments",
        "Add monitoring, inspect slow queries/calls, and optimize hotspots",
        "Disable authentication",
        "Increase response payload size",
      ],
      correctAnswerIndex: 1,
    },
    {
      question: `What helps teams collaborate effectively on ${stack} codebases?`,
      options: [
        "No branching strategy",
        "Consistent conventions, linting, and documented workflows",
        "Only one developer allowed to review",
        "Merging without checks",
      ],
      correctAnswerIndex: 1,
    },
    {
      question: `How should you validate user input in ${stack} applications?`,
      options: [
        "Validate on server side and sanitize inputs",
        "Trust all client input",
        "Disable validation for speed",
        "Validate only in production emergencies",
      ],
      correctAnswerIndex: 0,
    },
    {
      question: `Which approach is best for learning from failed interview answers in ${stack}?`,
      options: [
        "Repeat mistakes without review",
        "Analyze wrong choices and revise underlying concepts",
        "Memorize random answers only",
        "Avoid timed practice",
      ],
      correctAnswerIndex: 1,
    },
  ];

  const unique = normalizeMcqs(templates, blocked);
  return unique.slice(0, count);
}

export async function POST(req) {
  try {
    const payload = await req.json();
    const input = normalizePayload(payload);

    if (!input.stack || !input.difficulty) {
      return NextResponse.json(
        { message: "stack and difficulty are required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Missing GEMINI_API_KEY in environment variables" },
        { status: 500 },
      );
    }

    let parsed = null;
    let raw = "";
    let finishReason = "";
    let parseError = null;
    let mcqs = [];
    const blocked = new Set(input.excludeQuestions.map((q) => canonicalizeQuestion(q)));

    for (let attempt = 0; attempt < 3 && mcqs.length < 10; attempt += 1) {
      const nonce = `${Date.now()}-${Math.floor(Math.random() * 100000)}-${attempt}`;
      const usedQuestions = mcqs.map((item) => item.question);
      const finalPrompt =
        attempt === 0
          ? buildPrompt(
              { ...input, excludeQuestions: [...input.excludeQuestions, ...usedQuestions] },
              nonce,
            )
          : `${buildPrompt(
              { ...input, excludeQuestions: [...input.excludeQuestions, ...usedQuestions] },
              nonce,
            )}\n\nYour previous output was invalid or repetitive. Return complete valid JSON only with entirely new questions.`;

      const generation = await callGemini(finalPrompt, apiKey);
      raw = generation.text;
      finishReason = generation.finishReason;

      try {
        const parsedResult = tryParseGeminiJson(raw);
        parsed = parsedResult.parsed;
        parseError = parsedResult.parseError;
        if (!parsed) {
          continue;
        }
        const batch = normalizeMcqs(parsed?.mcqs, blocked);
        batch.forEach((item) => blocked.add(canonicalizeQuestion(item.question)));
        mcqs = [...mcqs, ...batch].slice(0, 10);
      } catch (error) {
        parseError = error;
      }
    }

    if (!parsed || !mcqs.length) {
      const fallbackMcqs = buildLocalFallbackMcqs(input, blocked);
      if (fallbackMcqs.length) {
        return NextResponse.json(
          {
            mcqs: fallbackMcqs,
            source: "local-fallback",
          },
          { status: 200 },
        );
      }
      return NextResponse.json(
        {
          message: "Unable to parse Gemini output as JSON",
          finishReason,
          raw,
          error: parseError?.message,
        },
        { status: 502 },
      );
    }
    if (mcqs.length < 8) {
      const fallbackMcqs = buildLocalFallbackMcqs(input, blocked, 10);
      const merged = [...mcqs, ...fallbackMcqs].slice(0, 10);
      if (merged.length >= 8) {
        return NextResponse.json(
          {
            mcqs: merged,
            source: "gemini+fallback",
          },
          { status: 200 },
        );
      }
      return NextResponse.json(
        { message: "Unable to generate a sufficiently unique MCQ set. Try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ mcqs, source: "gemini" }, { status: 200 });
  } catch (error) {
    console.error("MCQ generation error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
