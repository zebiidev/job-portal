import { NextResponse } from "next/server";

const requiredFields = [
  "fullName",
  "title",
  "email",
  "phone",
  "location",
  "summary",
  "skills",
  "experience",
  "education",
];

function normalizeInput(payload = {}) {
  return {
    fullName: String(payload.fullName || "").trim(),
    title: String(payload.title || "").trim(),
    email: String(payload.email || "").trim(),
    phone: String(payload.phone || "").trim(),
    location: String(payload.location || "").trim(),
    linkedin: String(payload.linkedin || "").trim(),
    github: String(payload.github || "").trim(),
    portfolioUrl: String(payload.portfolioUrl || "").trim(),
    summary: String(payload.summary || "").trim(),
    skills: String(payload.skills || "").trim(),
    technicalSkills: String(payload.technicalSkills || "").trim(),
    tools: String(payload.tools || "").trim(),
    softSkills: String(payload.softSkills || "").trim(),
    languages: String(payload.languages || "").trim(),
    experience: String(payload.experience || "").trim(),
    education: String(payload.education || "").trim(),
    projects: String(payload.projects || "").trim(),
    certifications: String(payload.certifications || "").trim(),
    achievements: String(payload.achievements || "").trim(),
    jobTarget: String(payload.jobTarget || "").trim(),
    jobDescription: String(payload.jobDescription || "").trim(),
    experienceLevel: String(payload.experienceLevel || "").trim(),
    tone: String(payload.tone || "professional").trim(),
    length: String(payload.length || "medium").trim(),
  };
}

function validateInput(form) {
  const missing = requiredFields.filter((field) => !form[field]);

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  return null;
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

function buildPrompt(form) {
  return `
You are an expert resume writer and ATS optimization assistant.
Generate a polished, truthful, ATS-friendly resume from the candidate details below.

Output rules:
1) Return ONLY valid JSON (no markdown, no explanations).
2) Keep claims grounded in provided data. Do not invent employers, years, or certifications.
3) Never mention assumptions, guesses, or placeholders such as "assumed", "not provided", or "N/A" inside resume content.
4) If any detail is missing, write neutral professional wording without fabricating facts.
5) Improve grammar, impact, and clarity.
6) Keep bullet points concise and measurable where possible.

Use this exact JSON schema:
{
  "fullName": "string",
  "title": "string",
  "contact": {
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "portfolioUrl": "string"
  },
  "summary": "string",
  "skills": ["string"],
  "technicalSkills": ["string"],
  "tools": ["string"],
  "softSkills": ["string"],
  "languages": ["string"],
  "experience": ["string"],
  "education": ["string"],
  "projects": ["string"],
  "certifications": ["string"],
  "achievements": ["string"],
  "targetRole": "string",
  "experienceLevel": "string",
  "highlights": ["string"],
  "atsKeywords": ["string"]
}

If optional data is not provided, return empty arrays [] or empty strings "" for those fields.

Candidate Input:
Full Name: ${form.fullName}
Professional Title: ${form.title}
Email: ${form.email}
Phone: ${form.phone}
Location: ${form.location}
LinkedIn URL: ${form.linkedin || "Not shared"}
GitHub URL: ${form.github || "Not shared"}
Portfolio URL: ${form.portfolioUrl || "Not shared"}
Career Summary Draft: ${form.summary}
Skills (raw): ${form.skills}
Technical Skills (raw): ${form.technicalSkills || "Not shared"}
Tools (raw): ${form.tools || "Not shared"}
Soft Skills (raw): ${form.softSkills || "Not shared"}
Languages (raw): ${form.languages || "Not shared"}
Experience (raw): ${form.experience}
Education (raw): ${form.education}
Projects (raw): ${form.projects || "Not shared"}
Certifications (raw): ${form.certifications || "Not shared"}
Achievements/Awards (raw): ${form.achievements || "Not shared"}
Target Role (optional): ${form.jobTarget || "N/A"}
Target Role Level (optional): ${form.experienceLevel || "N/A"}
Job Description (optional): ${form.jobDescription || "N/A"}
Tone: ${form.tone}
Length Preference: ${form.length}
`.trim();
}

async function callGemini(prompt, apiKey) {
  const model =
    process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
            fullName: { type: "STRING" },
            title: { type: "STRING" },
            contact: {
              type: "OBJECT",
              properties: {
                email: { type: "STRING" },
                phone: { type: "STRING" },
                location: { type: "STRING" },
                linkedin: { type: "STRING" },
                github: { type: "STRING" },
                portfolioUrl: { type: "STRING" },
              },
              required: ["email", "phone", "location"],
            },
            summary: { type: "STRING" },
            skills: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            technicalSkills: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            tools: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            softSkills: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            languages: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            experience: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            education: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            projects: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            certifications: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            achievements: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            targetRole: { type: "STRING" },
            experienceLevel: { type: "STRING" },
            highlights: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            atsKeywords: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
          },
          required: [
            "fullName",
            "title",
            "contact",
            "summary",
            "skills",
            "experience",
            "education",
            "highlights",
            "atsKeywords",
          ],
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const geminiMessage =
      data?.error?.message || "Failed to generate resume from Gemini";
    throw new Error(geminiMessage);
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

export async function POST(req) {
  try {
    const payload = await req.json();
    const form = normalizeInput(payload);

    const validationError = validateInput(form);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Missing GEMINI_API_KEY in environment variables" },
        { status: 500 },
      );
    }

    const prompt = buildPrompt(form);
    let resume = null;
    let rawText = "";
    let finishReason = "";
    let parseError = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const finalPrompt =
        attempt === 0
          ? prompt
          : `${prompt}\n\nYour previous output was invalid/truncated. Return COMPLETE valid JSON only.`;
      const generation = await callGemini(finalPrompt, apiKey);

      rawText = generation.text;
      finishReason = generation.finishReason;
      const jsonString = extractJson(rawText);

      try {
        resume = JSON.parse(jsonString);
        parseError = null;
        break;
      } catch (error) {
        parseError = error;
      }
    }

    if (!resume) {
      return NextResponse.json(
        {
          message: "Unable to parse Gemini output as JSON",
          finishReason,
          raw: rawText,
          error: parseError?.message,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        message: "Resume generated successfully",
        resume,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("AI Resume generation error:", error);
    return NextResponse.json(
      {
        message: error?.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
